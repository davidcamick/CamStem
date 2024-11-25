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

    # Explicitly set PATH to include common locations for demucs
    os.environ["PATH"] = (
        os.environ.get("PATH", "") + ":"  # Retain the existing PATH
        + "/Users/david/.pyenv/shims:"  # Common for pyenv users
        + "/usr/local/bin:"  # Common for global installations
        + "/opt/homebrew/bin"  # macOS with Homebrew
    )
    print(f"Updated PATH: {os.environ['PATH']}")

    # Check if the `demucs` command is available
    demucs_path = shutil.which("demucs")
    if not demucs_path:
        raise FileNotFoundError(
            "The 'demucs' command was not found. Please ensure it is installed and accessible in your PATH."
        )

    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Build the Demucs command
    demucs_command = [
        demucs_path,  # Path to the `demucs` binary
        "-n", model_name,  # Model name
        "--mp3",           # Export as MP3
        "--out", output_dir,
        input_file_path
    ]

    # Debugging: Print the command
    print("Running command:", " ".join(demucs_command))

    try:
        # Run the Demucs command
        subprocess.run(demucs_command, check=True)
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
