import sys
import subprocess

def download_song(link, output_path):
    try:
        print(f"Downloading song from: {link}")
        print(f"Output will be saved to: {output_path}")
        # Call spotDL with the provided link and output path
        subprocess.run(['spotdl', link, '--output', output_path], check=True)
        print("Download complete!")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Please provide a Spotify link and an output path.")
        sys.exit(1)

    spotify_link = sys.argv[1]
    output_path = sys.argv[2]
    download_song(spotify_link, output_path)
