import os
import sys
import subprocess
import tempfile
import torch
import time
from PySide6.QtWidgets import (QApplication, QMainWindow, QLabel, QLineEdit, QPushButton, 
                               QComboBox, QProgressBar, QFileDialog, QMessageBox, QVBoxLayout, QWidget)
from PySide6.QtCore import Qt, QThread, Signal

def check_ffmpeg():
    try:
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception:
        print("FFmpeg not found.")

def convert_mp3_to_wav(mp3_path, wav_path):
    try:
        subprocess.run(['ffmpeg', '-i', mp3_path, wav_path, '-hide_banner', '-loglevel', 'error'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Conversion Error: {e}")
        sys.exit(1)

def run_demucs(wav_path, output_dir, model_name):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    try:
        subprocess.run(['py', '-m', 'demucs', wav_path, '-o', output_dir, '--device', device, '-n', model_name], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Demucs Error: {e}")
        sys.exit(1)

class AudioProcessThread(QThread):
    progress_updated = Signal(int)
    process_complete = Signal()

    def __init__(self, mp3_path, model_name):
        super().__init__()
        self.mp3_path = mp3_path
        self.model_name = model_name

    def run(self):
        mp3_dir = os.path.dirname(self.mp3_path)
        mp3_filename = os.path.splitext(os.path.basename(self.mp3_path))[0]
        output_folder = os.path.join(mp3_dir, mp3_filename + "_stems")

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        with tempfile.TemporaryDirectory() as temp_dir:
            audio_file_wav = os.path.join(temp_dir, mp3_filename + ".wav")
            convert_mp3_to_wav(self.mp3_path, audio_file_wav)
            run_demucs(audio_file_wav, output_folder, self.model_name)

            for i in range(5):  # Simulate progress for 5 steps
                time.sleep(1)
                self.progress_updated.emit((i + 1) * 20)
        
        self.process_complete.emit()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CamStemV1")
        self.setGeometry(100, 100, 400, 200)

        # Create UI elements
        self.label = QLabel("Select MP3:", self)
        self.audio_file_entry = QLineEdit(self)
        self.browse_button = QPushButton("Browse", self)
        self.model_dropdown = QComboBox(self)
        self.progress_bar = QProgressBar(self)
        self.process_button = QPushButton("Process", self)

        # Setup model dropdown
        self.model_dropdown.addItems([
            "Default (4 Stems)",
            "High Quality (4 Stems - may take longer)",
            "Expanded (6 Stems - may be buggy)",
            "Lightweight (4 Stems - for fast processing)"
        ])

        # Layout
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.audio_file_entry)
        layout.addWidget(self.browse_button)
        layout.addWidget(self.model_dropdown)
        layout.addWidget(self.progress_bar)
        layout.addWidget(self.process_button)

        # Central widget
        central_widget = QWidget(self)
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)

        # Connect buttons
        self.browse_button.clicked.connect(self.select_audio_file)
        self.process_button.clicked.connect(self.start_audio_processing)

    def select_audio_file(self):
        file_dialog = QFileDialog(self)
        file_dialog.setNameFilter("MP3 Files (*.mp3)")
        if file_dialog.exec():
            file_path = file_dialog.selectedFiles()[0]
            self.audio_file_entry.setText(file_path)

    def start_audio_processing(self):
        mp3_file = self.audio_file_entry.text()
        if not os.path.isfile(mp3_file):
            QMessageBox.critical(self, "Error", "Invalid MP3 file.")
            return

        model_mapping = {
            "Default (4 Stems)": "htdemucs",
            "High Quality (4 Stems - may take longer)": "htdemucs_extra",
            "Expanded (6 Stems - may be buggy)": "htdemucs_6s",
            "Lightweight (4 Stems - for fast processing)": "light"
        }
        model_name = model_mapping[self.model_dropdown.currentText()]

        # Create and start the thread
        self.process_thread = AudioProcessThread(mp3_file, model_name)
        self.process_thread.progress_updated.connect(self.update_progress)
        self.process_thread.process_complete.connect(self.on_process_complete)
        self.process_thread.start()

    def update_progress(self, value):
        self.progress_bar.setValue(value)

    def on_process_complete(self):
        QMessageBox.information(self, "Process Complete", "Audio processing is complete.")

if __name__ == "__main__":
    check_ffmpeg()
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
