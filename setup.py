from cx_Freeze import setup, Executable
import os
import subprocess

# Post-build hook to fix library paths
def fix_library_paths(build_dir):
    executable = os.path.join(build_dir, "camstem_backend")
    lib_path = "/Users/david/.pyenv/versions/3.9.17/lib/libpython3.9.dylib"
    subprocess.run(
        ["install_name_tool", "-change", lib_path, "@rpath/libpython3.9.dylib", executable]
    )
    print(f"Fixed library paths in {executable}")

# Ensure cx_Freeze finds the dynamic library
os.environ["DYLD_LIBRARY_PATH"] = "/Users/david/.pyenv/versions/3.9.17/lib"

# Additional files to include in the build
include_files = [
    ("/Users/david/.pyenv/versions/3.9.17/lib/libpython3.9.dylib", "libpython3.9.dylib"),  # Absolute path
    ('src/bin/ffmpeg', 'bin/ffmpeg'),  # Include FFmpeg binary
]

# Build options for cx_Freeze
build_exe_options = {
    "packages": ["os", "shutil", "subprocess", "argparse", "encodings"],
    "includes": ["torch", "torchaudio", "codecs", "io", "abc"],
    "include_files": include_files,
    "excludes": ["tkinter"],
}

# Define the executable
executables = [
    Executable(
        script="src/python-backend/backend.py",
        target_name="camstem_backend",
    )
]

# Setup configuration
setup(
    name="CamStemBackend",
    version="1.0",
    description="Audio stem-splitting backend for CamStem",
    options={"build_exe": build_exe_options},
    executables=executables,
)

# Post-build step
if "build" in os.sys.argv:
    build_dir = os.path.join(os.getcwd(), "build", "exe.macosx-15.2-arm64-3.9")
    fix_library_paths(build_dir)
