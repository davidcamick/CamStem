import os
import sys
import subprocess
import tempfile
import torch
import shutil
import re
from PySide6.QtWidgets import (QApplication, QMainWindow, QLabel, QLineEdit, QPushButton,
                               QVBoxLayout, QWidget, QHBoxLayout, QMessageBox, QFileDialog, QGridLayout)
from PySide6.QtCore import Qt, QThread, Signal, QFile, QTextStream
from PySide6.QtGui import QFont

def check_ffmpeg():
    try:
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception:
        print("FFmpeg not found.")

def convert_mp3_to_wav(mp3_path, wav_path):
    try:
        print(f"Converting MP3 to WAV: {mp3_path} -> {wav_path}")
        subprocess.run(['ffmpeg', '-i', mp3_path, wav_path, '-hide_banner', '-loglevel', 'error'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Conversion Error: {e}")
        sys.exit(1)

def download_spotify_audio(spotify_url, output_dir):
    try:
        spotdl_path = r"C:\Users\paulc\AppData\Local\Programs\Python\Python311\Scripts\spotdl.exe"
        print(f"Downloading Spotify audio for: {spotify_url}")

        # Use --output instead of --path, and add --overwrite force
        process = subprocess.run(
            [spotdl_path, 'download', spotify_url, '--output', output_dir, '--overwrite', 'force'],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        
        # Print both standard output and error
        print(f"stdout: {process.stdout}")
        print(f"stderr: {process.stderr}")

        # Check for errors
        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, process.args)

        # List the files in the output directory to find the actual downloaded file
        downloaded_files = [f for f in os.listdir(output_dir) if f.endswith('.mp3')]
        if not downloaded_files:
            print("Download failed or no MP3 file found in output.")
            sys.exit(1)

        # Return the path of the first MP3 file found
        downloaded_file_path = os.path.join(output_dir, downloaded_files[0])
        print(f"Downloaded file: {downloaded_file_path}")
        return downloaded_file_path

    except subprocess.CalledProcessError as e:
        print(f"Spotify Download Error: {e}")
        sys.exit(1)

def run_demucs(wav_path, model_name, progress_signal):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    output_dir = os.path.join(os.getcwd(), "tempStems")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        print(f"Running Demucs on WAV file: {wav_path}")
        print(f"Output Directory: {output_dir}")

        process = subprocess.Popen(
            ['py', '-m', 'demucs', wav_path, '-o', output_dir, '--device', device, '-n', model_name],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True, bufsize=1
        )

        # Read output line by line to avoid buffering issues
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())  # Log output to terminal
                # Look for the percentage progress (e.g., "[50%] Processing..."])
                match = re.search(r'\[(\d+)%\]', output)
                if match:
                    progress = int(match.group(1))
                    progress_signal.emit(progress)  # Emit signal to update the UI

        process.wait()  # Wait for the process to finish
        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, process.args)

    except subprocess.CalledProcessError as e:
        print(f"Demucs Error: {e}")
        sys.exit(1)

def move_stems_to_named_folder(output_dir, final_output_dir, mp3_filename):
    try:
        destination_folder = os.path.join(final_output_dir, mp3_filename)
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)

        for root, _, files in os.walk(output_dir):
            for file in files:
                full_file_path = os.path.join(root, file)
                shutil.move(full_file_path, os.path.join(destination_folder, file))
        
        if not os.listdir(output_dir):
            os.rmdir(output_dir)

        print(f"Stems successfully moved to {destination_folder}")
    except Exception as e:
        print(f"Error moving stems: {e}")
        sys.exit(1)

class AudioProcessThread(QThread):
    process_complete = Signal()
    progress_update = Signal(int)  # Signal to send progress updates

    def __init__(self, mp3_path, model_name, open_output_dir, final_output_dir, is_spotify=False):
        super().__init__()
        self.mp3_path = mp3_path
        self.model_name = model_name
        self.open_output_dir = open_output_dir
        self.final_output_dir = final_output_dir  # New final output directory
        self.is_spotify = is_spotify

    def run(self):
        mp3_dir = os.path.dirname(self.mp3_path)
        mp3_filename = os.path.splitext(os.path.basename(self.mp3_path))[0]
        output_folder = os.path.join(os.getcwd(), "tempStems")

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # Convert MP3 to WAV in temp folder
        with tempfile.TemporaryDirectory() as temp_dir:
            audio_file_wav = os.path.join(temp_dir, mp3_filename + ".wav")
            convert_mp3_to_wav(self.mp3_path, audio_file_wav)

            print(f"Starting Demucs splitting process for {audio_file_wav}...")

            run_demucs(audio_file_wav, self.model_name, self.progress_update)

            move_stems_to_named_folder(output_folder, self.final_output_dir, mp3_filename)

        if self.open_output_dir:
            os.startfile(os.path.join(self.final_output_dir, mp3_filename))

        self.process_complete.emit()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setObjectName("mainWindow")  # Set the object name to be used in CSS
        self.setWindowTitle("CamStemV1")
        self.setFixedSize(450, 800)

        # Load the external stylesheet
        self.load_stylesheet()

        # Set up the label for selecting MP3/Spotify URL
        self.label_select_mp3 = QLabel("Select MP3 or Spotify URL for Splitting:", self)
        self.label_select_mp3.setAlignment(Qt.AlignCenter)
        self.label_select_mp3.setWordWrap(True)
        self.label_select_mp3.setFont(QFont("Consola Mono", 24, QFont.Bold))  # 50% larger (24px) and bold
        self.label_select_mp3.setStyleSheet("color: white;")  # Set text color to white

        # Buttons and file input setup
        self.browse_button = QPushButton("Browse", self)
        self.browse_button.clicked.connect(self.select_audio_file)

        self.paste_button = QPushButton("Paste File or Spotify URL", self)
        self.paste_button.clicked.connect(self.toggle_file_entry)

        self.audio_file_entry = QLineEdit(self)
        self.audio_file_entry.hide()

        # Label for selecting method
        self.label_select_method = QLabel("Please select the method for splitting:", self)
        self.label_select_method.setAlignment(Qt.AlignCenter)
        self.label_select_method.setWordWrap(True)
        self.label_select_method.setFont(QFont("Consola Mono", 24, QFont.Bold))  # 50% larger and bold
        self.label_select_method.setStyleSheet("color: white;")

        # Splitting method buttons
        self.method_default_button = QPushButton("Default (4 Stems)", self)
        self.method_high_quality_button = QPushButton("High Quality (4 Stems)", self)
        self.method_expanded_button = QPushButton("Expanded (6 Stems)", self)
        self.method_lightweight_button = QPushButton("Lightweight (4 Stems)")

        self.buttons = [self.method_default_button, self.method_high_quality_button,
                        self.method_expanded_button, self.method_lightweight_button]

        for button in self.buttons:
            button.setCheckable(True)
            button.clicked.connect(self.handle_button_click)

        # Label for opening output directory
        self.label_open_output = QLabel("Would you like to open the output directory once finished?", self)
        self.label_open_output.setAlignment(Qt.AlignCenter)
        self.label_open_output.setWordWrap(True)
        self.label_open_output.setFont(QFont("Consola Mono", 24, QFont.Bold))  # 50% larger and bold
        self.label_open_output.setStyleSheet("color: white;")

        # Yes/No buttons for opening output directory
        self.yes_button = QPushButton("Yes", self)
        self.no_button = QPushButton("No", self)
        self.yes_button.setCheckable(True)
        self.no_button.setCheckable(True)
        self.yes_button.clicked.connect(lambda: self.set_open_output(True))
        self.no_button.clicked.connect(lambda: self.set_open_output(False))

        # Select output folder button
        self.output_button = QPushButton("Select Output Folder", self)
        self.output_button.clicked.connect(self.select_output_folder)

        self.output_directory = None

        # Process button
        self.process_button = QPushButton("Process", self)

        # Progress label
        self.progress_label = QLabel("", self)
        self.progress_label.setAlignment(Qt.AlignCenter)

        # Layout setup
        main_layout = QVBoxLayout()

        file_buttons_layout = QHBoxLayout()
        file_buttons_layout.addWidget(self.browse_button)
        file_buttons_layout.addWidget(self.paste_button)

        methods_layout = QGridLayout()
        methods_layout.addWidget(self.method_default_button, 0, 0)
        methods_layout.addWidget(self.method_high_quality_button, 0, 1)
        methods_layout.addWidget(self.method_expanded_button, 1, 0)
        methods_layout.addWidget(self.method_lightweight_button, 1, 1)

        open_output_layout = QHBoxLayout()
        open_output_layout.addWidget(self.yes_button)
        open_output_layout.addWidget(self.no_button)

        main_layout.addWidget(self.label_select_mp3)
        main_layout.addLayout(file_buttons_layout)
        main_layout.addWidget(self.audio_file_entry)
        main_layout.addWidget(self.label_select_method)
        main_layout.addLayout(methods_layout)
        main_layout.addWidget(self.label_open_output)
        main_layout.addLayout(open_output_layout)
        main_layout.addWidget(self.output_button)
        main_layout.addWidget(self.process_button)
        main_layout.addWidget(self.progress_label)

        central_widget = QWidget(self)
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

    def __init__(self):
        super().__init__()
        self.setWindowTitle("CamStemV1")
        self.setFixedSize(450, 800)

        # Load the external stylesheet
        self.load_stylesheet()

        # Apply Consola Mono globally
        self.setFont(QFont("Consola Mono"))

        self.label_select_mp3 = QLabel("Select MP3 or Spotify URL for Splitting:", self)
        self.label_select_mp3.setAlignment(Qt.AlignCenter)
        self.label_select_mp3.setWordWrap(True)

        self.browse_button = QPushButton("Browse", self)
        self.browse_button.clicked.connect(self.select_audio_file)

        self.paste_button = QPushButton("Paste File or Spotify URL", self)
        self.paste_button.clicked.connect(self.toggle_file_entry)

        self.audio_file_entry = QLineEdit(self)
        self.audio_file_entry.hide()

        self.label_select_method = QLabel("Please select the method for splitting:", self)
        self.label_select_method.setAlignment(Qt.AlignCenter)
        self.label_select_method.setWordWrap(True)

        self.method_default_button = QPushButton("Default (4 Stems)", self)
        self.method_high_quality_button = QPushButton("High Quality (4 Stems)", self)
        self.method_expanded_button = QPushButton("Expanded (6 Stems)", self)
        self.method_lightweight_button = QPushButton("Lightweight (4 Stems)")

        self.buttons = [self.method_default_button, self.method_high_quality_button,
                        self.method_expanded_button, self.method_lightweight_button]

        for button in self.buttons:
            button.setCheckable(True)
            button.clicked.connect(self.handle_button_click)
            button.setStyleSheet("QPushButton { padding: 10px; }"
                                 "QPushButton:checked { background-color: #a0a0a0; }")

        self.label_open_output = QLabel("Would you like to open the output directory once finished?", self)
        self.label_open_output.setAlignment(Qt.AlignCenter)
        self.label_open_output.setWordWrap(True)

        self.yes_button = QPushButton("Yes", self)
        self.no_button = QPushButton("No", self)
        self.yes_button.setCheckable(True)
        self.no_button.setCheckable(True)
        self.yes_button.clicked.connect(lambda: self.set_open_output(True))
        self.no_button.clicked.connect(lambda: self.set_open_output(False))
        self.yes_button.setStyleSheet("QPushButton:checked { background-color: #a0a0a0; }")
        self.no_button.setStyleSheet("QPushButton:checked { background-color: #a0a0a0; }")

        self.output_button = QPushButton("Select Output Folder", self)
        self.output_button.clicked.connect(self.select_output_folder)

        self.output_directory = None

        self.process_button = QPushButton("Process", self)
        self.process_button.setFont(QFont("Consola Mono", 20))  # Apply font to the Process button

        # Progress label below the process button
        self.progress_label = QLabel("", self)
        self.progress_label.setAlignment(Qt.AlignCenter)

        # Layout setup
        main_layout = QVBoxLayout()

        file_buttons_layout = QHBoxLayout()
        file_buttons_layout.addWidget(self.browse_button)
        file_buttons_layout.addWidget(self.paste_button)

        methods_layout = QGridLayout()
        methods_layout.addWidget(self.method_default_button, 0, 0)
        methods_layout.addWidget(self.method_high_quality_button, 0, 1)
        methods_layout.addWidget(self.method_expanded_button, 1, 0)
        methods_layout.addWidget(self.method_lightweight_button, 1, 1)

        open_output_layout = QHBoxLayout()
        open_output_layout.addWidget(self.yes_button)
        open_output_layout.addWidget(self.no_button)

        main_layout.addWidget(self.label_select_mp3)
        main_layout.addLayout(file_buttons_layout)
        main_layout.addWidget(self.audio_file_entry)
        main_layout.addWidget(self.label_select_method)
        main_layout.addLayout(methods_layout)
        main_layout.addWidget(self.label_open_output)
        main_layout.addLayout(open_output_layout)
        main_layout.addWidget(self.output_button)
        main_layout.addWidget(self.process_button)
        main_layout.addWidget(self.progress_label)

        central_widget = QWidget(self)
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

    def load_stylesheet(self):
        file = QFile("style.css")
        if file.open(QFile.ReadOnly | QFile.Text):
            stream = QTextStream(file)
            self.setStyleSheet(stream.readAll())
            print("Stylesheet loaded successfully")  # Debugging message
        else:
            print("Failed to load stylesheet")  # Debugging message


    def handle_button_click(self):
        for button in self.buttons:
            if button is not self.sender():
                button.setChecked(False)

    def toggle_file_entry(self):
        self.audio_file_entry.setVisible(not self.audio_file_entry.isVisible())

    def select_audio_file(self):
        file_dialog = QFileDialog(self)
        file_dialog.setNameFilter("MP3 Files (*.mp3)")
        if file_dialog.exec():
            file_path = file_dialog.selectedFiles()[0]
            self.audio_file_entry.setText(file_path)
            self.audio_file_entry.show()

    def set_open_output(self, open_it):
        self.yes_button.setChecked(open_it)
        self.no_button.setChecked(not open_it)
        for button in [self.yes_button, self.no_button]:
            if button.isChecked():
                button.setStyleSheet("background-color: #a0a0a0;")
            else:
                button.setStyleSheet("")

    def select_output_folder(self):
        self.output_directory = QFileDialog.getExistingDirectory(self, "Select Output Folder")
        if self.output_directory:
            print(f"Output folder selected: {self.output_directory}")

    def start_processing(self):
        audio_input = self.audio_file_entry.text()
        is_spotify = False

        # Check if the input is a Spotify URL
        if "spotify" in audio_input:
            output_dir = os.path.join(os.getcwd(), "tempStems")
            mp3_file = download_spotify_audio(audio_input, output_dir)  # Download via Spotify
            is_spotify = True
        elif os.path.isfile(audio_input):
            mp3_file = audio_input  # It's a local MP3 file
        else:
            QMessageBox.critical(self, "Error", "Invalid MP3 file or Spotify URL.")
            return

        if not self.output_directory:
            QMessageBox.critical(self, "Error", "Please select an output folder for the stems.")
            return

        selected_method = None
        for button, method in zip(self.buttons, ["htdemucs", "htdemucs_ft", "htdemucs_6s", "hdemucs_mmi"]):
            if button.isChecked():
                selected_method = method
                break
        if not selected_method:
            QMessageBox.critical(self, "Error", "Please select a splitting method.")
            return
        
        self.progress_label.setText("Progress: 0%")  # Initialize progress label
        self.process_thread = AudioProcessThread(mp3_file, selected_method, self.yes_button.isChecked(), self.output_directory, is_spotify)
        self.process_thread.progress_update.connect(self.update_progress)  # Connect progress signal to label
        self.process_thread.process_complete.connect(self.on_process_complete)
        self.process_thread.start()

    def update_progress(self, progress):
        self.progress_label.setText(f"Progress: {progress}%")  # Update progress label

    def on_process_complete(self):
        self.progress_label.setText("Process complete!")  # Show completion message
        QMessageBox.information(self, "Process Complete", "Audio processing is complete.")

if __name__ == "__main__":
    check_ffmpeg()
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
