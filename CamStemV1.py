import os
import sys
import subprocess
import tempfile
import torch
import shutil
from PySide6.QtWidgets import (QApplication, QMainWindow, QLabel, QLineEdit, QPushButton,
                               QVBoxLayout, QWidget, QHBoxLayout, QMessageBox, QFileDialog, QGridLayout)
from PySide6.QtCore import Qt, QThread, Signal
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

def run_demucs(wav_path, model_name):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    # Relative path for the tempStems directory (within the app directory)
    output_dir = os.path.join(os.getcwd(), "tempStems")

    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Run Demucs and log the paths
        print(f"Running Demucs on WAV file: {wav_path}")
        print(f"Output Directory: {output_dir}")
        subprocess.run(['py', '-m', 'demucs', wav_path, '-o', output_dir, '--device', device, '-n', model_name], check=True)

        # Log a message confirming that Demucs ran successfully
        print(f"Stems successfully saved to {output_dir}")

    except subprocess.CalledProcessError as e:
        print(f"Demucs Error: {e}")
        sys.exit(1)

def move_stems_to_named_folder(output_dir, mp3_dir, mp3_filename):
    """
    Moves all the stems from the tempStems directory to a new folder named after the original MP3 file.
    """
    try:
        # Create a new folder named after the original MP3 file in the MP3's directory
        destination_folder = os.path.join(mp3_dir, mp3_filename)
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)

        # Move all files from the tempStems directory to the new folder
        for root, _, files in os.walk(output_dir):
            for file in files:
                full_file_path = os.path.join(root, file)
                shutil.move(full_file_path, os.path.join(destination_folder, file))
        
        # Cleanup: remove the tempStems directory if it's empty
        if not os.listdir(output_dir):
            os.rmdir(output_dir)

        print(f"Stems successfully moved to {destination_folder}")
    except Exception as e:
        print(f"Error moving stems: {e}")
        sys.exit(1)

class AudioProcessThread(QThread):
    process_complete = Signal()

    def __init__(self, mp3_path, model_name, open_output_dir):
        super().__init__()
        self.mp3_path = mp3_path
        self.model_name = model_name
        self.open_output_dir = open_output_dir

    def run(self):
        mp3_dir = os.path.dirname(self.mp3_path)
        mp3_filename = os.path.splitext(os.path.basename(self.mp3_path))[0]
        output_folder = os.path.join(os.getcwd(), "tempStems")

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        with tempfile.TemporaryDirectory() as temp_dir:
            audio_file_wav = os.path.join(temp_dir, mp3_filename + ".wav")
            convert_mp3_to_wav(self.mp3_path, audio_file_wav)

            # Log that we are starting the Demucs process
            print(f"Starting Demucs splitting process for {audio_file_wav}...")

            run_demucs(audio_file_wav, self.model_name)

            # After processing, move the stems to a folder named after the original file
            move_stems_to_named_folder(output_folder, mp3_dir, mp3_filename)

        if self.open_output_dir:
            os.startfile(os.path.join(mp3_dir, mp3_filename))

        self.process_complete.emit()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CamStemV1")
        self.setFixedSize(450, 800)
        self.setFont(QFont('Arial', 16))

        self.label_select_mp3 = QLabel("Select Mp3 File for Splitting:", self)
        self.label_select_mp3.setAlignment(Qt.AlignCenter)
        self.label_select_mp3.setFont(QFont('Arial', 16))
        self.label_select_mp3.setWordWrap(True)

        self.browse_button = QPushButton("Browse", self)
        self.browse_button.setFont(QFont('Arial', 16))
        self.browse_button.clicked.connect(self.select_audio_file)

        self.paste_button = QPushButton("Paste File Path", self)
        self.paste_button.setFont(QFont('Arial', 16))
        self.paste_button.clicked.connect(self.toggle_file_entry)

        self.audio_file_entry = QLineEdit(self)
        self.audio_file_entry.hide()

        self.label_select_method = QLabel("Please select the method for splitting:", self)
        self.label_select_method.setAlignment(Qt.AlignCenter)
        self.label_select_method.setFont(QFont('Arial', 16))
        self.label_select_method.setWordWrap(True)

        self.method_default_button = QPushButton("Default (4 Stems)", self)
        self.method_high_quality_button = QPushButton("High Quality (4 Stems)", self)
        self.method_expanded_button = QPushButton("Expanded (6 Stems)", self)
        self.method_lightweight_button = QPushButton("Lightweight (4 Stems)", self)

        self.buttons = [self.method_default_button, self.method_high_quality_button,
                        self.method_expanded_button, self.method_lightweight_button]

        for button in self.buttons:
            button.setCheckable(True)
            button.clicked.connect(self.handle_button_click)
            button.setStyleSheet("QPushButton { padding: 10px; }"
                                 "QPushButton:checked { background-color: #a0a0a0; }")

        self.label_open_output = QLabel("Would you like to open the output directory once finished?", self)
        self.label_open_output.setAlignment(Qt.AlignCenter)
        self.label_open_output.setFont(QFont('Arial', 16))
        self.label_open_output.setWordWrap(True)

        self.yes_button = QPushButton("Yes", self)
        self.no_button = QPushButton("No", self)
        self.yes_button.setCheckable(True)
        self.no_button.setCheckable(True)
        self.yes_button.clicked.connect(lambda: self.set_open_output(True))
        self.no_button.clicked.connect(lambda: self.set_open_output(False))
        self.yes_button.setStyleSheet("QPushButton:checked { background-color: #a0a0a0; }")
        self.no_button.setStyleSheet("QPushButton:checked { background-color: #a0a0a0; }")

        self.process_button = QPushButton("Process", self)
        self.process_button.setFont(QFont('Arial', 20))
        self.process_button.clicked.connect(self.start_processing)

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
        main_layout.addWidget(self.process_button)

        central_widget = QWidget(self)
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

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

    def start_processing(self):
        mp3_file = self.audio_file_entry.text()
        if not os.path.isfile(mp3_file):
            QMessageBox.critical(self, "Error", "Invalid MP3 file.")
            return
        selected_method = None
        for button, method in zip(self.buttons, ["htdemucs", "htdemucs_ft", "htdemucs_6s", "hdemucs_mmi"]):
            if button.isChecked():
                selected_method = method
                break
        if not selected_method:
            QMessageBox.critical(self, "Error", "Please select a splitting method.")
            return
        self.process_thread = AudioProcessThread(mp3_file, selected_method, self.yes_button.isChecked())
        self.process_thread.process_complete.connect(self.on_process_complete)
        self.process_thread.start()

    def on_process_complete(self):
        QMessageBox.information(self, "Process Complete", "Audio processing is complete.")

if __name__ == "__main__":
    check_ffmpeg()
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())