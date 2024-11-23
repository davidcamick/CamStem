import os
import shutil
import subprocess
import argparse

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
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Run Demucs for audio stem separation.")
    parser.add_argument("--model", type=str, required=True, help="The Demucs model to use.")
    parser.add_argument("--input", type=str, required=True, help="Path to the input audio file.")
    parser.add_argument("--output", type=str, required=True, help="Path to the output directory.")

    args = parser.parse_args()

    # Validate input paths
    if not os.path.isfile(args.input):
        print(f"Error: Input file '{args.input}' does not exist.")
        exit(1)

    if not os.path.isdir(args.output):
        print(f"Error: Output directory '{args.output}' does not exist.")
        exit(1)

    # Run the stem separation process
    separate_stems(args.model, args.input, args.output)
