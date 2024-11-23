# -*- mode: python ; coding: utf-8 -*-
block_cipher = None

a = Analysis(
    ['src/python-backend/backend.py'],  # Entry point script
    pathex=[],
    binaries=[
        ('/Users/david/.pyenv/versions/3.9.17/lib/libpython3.9.dylib', '.'),  # Include libpython
        ('src/bin/ffmpeg', 'bin'),  # Include FFmpeg binary
    ],
    datas=[],
    hiddenimports=['encodings', 'codecs', 'io', 'abc', 'torch', 'torchaudio'],  # Add core modules
    hookspath=[],
    runtime_hooks=[],
    excludes=['tkinter'],  # Exclude unnecessary modules
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='camstem_backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='camstem_backend',
)
