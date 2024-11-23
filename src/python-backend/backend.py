# File path: /Users/david/Desktop/Project-CamStem/CamStemSoftware/src/python-backend/backend.py

import os
import shutil
import subprocess
import sys
import torchaudio
import json

# Set torchaudio backend to ffmpeg (if available)
try:
    torchaudio.set_audio_backend("ffmpeg")
except UserWarning:
    print("FFmpeg backend is already set or unavailable.")

# Function to run Demucs
def separate_stems(model_name, input_file_path, output_dir):
    """
    Runs the Demucs model to split audio stems.

    Args:
        model_name (str): The name of the Demucs model to use.
        input_file_path (str): Path to the input audio file.
        output_dir (str): Path to the output directory.
    """
    print("Starting stem separation...")
    print(f"Model: {model_name}")
    print(f"Input File: {input_file_path}")
    print(f"Output Directory: {output_dir}")

    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define the command for Demucs
    command = [
        "demucs",
        "-n", model_name,  # Model name
        "--mp3",           # Export as MP3
        "--out", output_dir,
        input_file_path
    ]

    # Debugging: Print the command
    print("Running command:", " ".join(command))

    try:
        # Run the Demucs command
        subprocess.run(command, check=True)

        # After splitting, move the song folder to the output directory
        htdemucs_folder = os.path.join(output_dir, "htdemucs")
        if os.path.exists(htdemucs_folder):
            for song_folder in os.listdir(htdemucs_folder):
                song_folder_path = os.path.join(htdemucs_folder, song_folder)

                # Ensure it's a directory
                if os.path.isdir(song_folder_path):
                    final_song_path = os.path.join(output_dir, song_folder)
                    
                    # Move the song folder to the output directory
                    shutil.move(song_folder_path, final_song_path)
                    print(f"Moved folder: {song_folder_path} -> {final_song_path}")
            
            # Remove the empty `htdemucs` folder
            shutil.rmtree(htdemucs_folder)
            print(f"Deleted folder: {htdemucs_folder}")

        print("Stem separation completed successfully!")
    
    except subprocess.CalledProcessError as e:
        print(f"Error during stem separation: {e}")
        raise

# Main execution logic
if __name__ == "__main__":
    # Read arguments from the command line
    if len(sys.argv) < 2:
        print("Error: Missing input JSON file.")
        sys.exit(1)

    # Get the JSON file path
    json_file_path = sys.argv[1]

    try:
        # Load paths from the JSON file
        with open(json_file_path, "r") as f:
            paths = json.load(f)
        
        model_name = paths.get("model_name", "htdemucs")
        input_file_path = paths["input_file_path"]
        output_dir = paths["output_dir"]

        # Validate paths
        if not os.path.isfile(input_file_path):
            print(f"Error: Input file '{input_file_path}' does not exist.")
            sys.exit(1)

        if not os.path.isdir(output_dir):
            print(f"Error: Output directory '{output_dir}' does not exist.")
            sys.exit(1)

        # Run the separation process
        separate_stems(model_name, input_file_path, output_dir)

    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON file.")
    except Exception as e:
        print(f"Process failed: {e}")
