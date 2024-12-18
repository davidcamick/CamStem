import os
import fnmatch

def load_whitelist_patterns(whitelist_file):
    patterns = []
    if os.path.exists(whitelist_file):
        with open(whitelist_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    patterns.append(line)
    return patterns

def matches_whitelist(path, patterns):
    # We match the exact relative path against the patterns.
    # If "src" is in whitelist, only "./src" matches, not "./backend/src".
    for pattern in patterns:
        if fnmatch.fnmatch(path, pattern):
            return True
    return False

def is_code_file(filename):
    # Common programming file extensions
    code_extensions = [
        '.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.java',
        '.cpp', '.c', '.go', '.rb', '.php', '.cs', '.sh', '.json'
    ]
    ext = os.path.splitext(filename)[1].lower()
    return ext in code_extensions

def include_subtree(path, base_dir, included_files):
    # Recursively include the entire subtree under 'path'
    structure = {'_files': {}}
    for item in os.listdir(path):
        full_path = os.path.join(path, item)
        rel_path = os.path.relpath(full_path, base_dir)
        if os.path.isfile(full_path):
            structure['_files'][item] = full_path
            included_files.append(full_path)
        else:
            # It's a directory
            subtree = include_subtree(full_path, base_dir, included_files)
            structure[item] = subtree
    return structure

def build_structure(base_dir, patterns):
    # We'll only include directories or files if they exactly match one of the patterns.
    # If a directory matches, include its entire subtree.
    # If a file matches, include just that file.
    structure = {'_files': {}}
    included_files = []

    def process_directory(current_dir, current_structure):
        rel_dir = os.path.relpath(current_dir, base_dir)
        if rel_dir == '.':
            rel_dir = ''

        # If directory exactly matches whitelist, include entire subtree
        if (rel_dir == '' and matches_whitelist('.', patterns)) or (rel_dir and matches_whitelist(rel_dir, patterns)):
            subtree = include_subtree(current_dir, base_dir, included_files)
            for k, v in subtree.items():
                current_structure[k] = v
            return

        # Otherwise, check children individually
        for item in os.listdir(current_dir):
            full_path = os.path.join(current_dir, item)
            rel_path = os.path.relpath(full_path, base_dir)
            if os.path.isfile(full_path):
                if matches_whitelist(rel_path, patterns):
                    current_structure['_files'][item] = full_path
                    included_files.append(full_path)
            else:
                # It's a directory
                if matches_whitelist(rel_path, patterns):
                    # Entire subtree included
                    subtree = include_subtree(full_path, base_dir, included_files)
                    current_structure[item] = subtree
                else:
                    # Not directly whitelisted, so check its contents individually
                    sub_structure = {'_files': {}}
                    process_directory(full_path, sub_structure)
                    # Only add if it contains something
                    if len(sub_structure) > 1 or len(sub_structure['_files']) > 0:
                        current_structure[item] = sub_structure

    process_directory(base_dir, structure)
    return structure, included_files

def write_structure_md(structure, out, indent=0):
    prefix = '  ' * indent
    # Print files first (no content, just structure)
    if '_files' in structure:
        for fname in structure['_files']:
            out.write(f"{prefix}- `{fname}`\n")
        out.write("\n")

    # Now directories
    for key, value in structure.items():
        if key == '_files':
            continue
        # It's a directory
        out.write(f"{prefix}`{key}`\n")
        out.write(f"{prefix}==============\n")
        write_structure_md(value, out, indent+1)

def delete_dot_underscore_files(base_dir):
    dot_underscore_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.startswith("._"):
                dot_underscore_files.append(os.path.join(root, file))
    if dot_underscore_files:
        print("Found the following `._` files:")
        for f in dot_underscore_files:
            print(f)
        choice = input("Do you want to delete these files? (y/n): ").strip().lower()
        if choice == 'y':
            for f in dot_underscore_files:
                try:
                    os.remove(f)
                except Exception as e:
                    print(f"Could not delete {f}: {e}")
            print("`._` files deleted.")
        else:
            print("`._` files not deleted.")

def main():
    base_dir = os.getcwd()
    whitelist_file = os.path.join(base_dir, 'promptsetup.whitelist')

    # Ask if user wants to create promptsetup.whitelist if it doesn't exist
    if not os.path.exists(whitelist_file):
        user_choice = input("promptsetup.whitelist does not exist. Would you like to create it? (y/n): ").strip().lower()
        if user_choice == 'y':
            # Sample content
            sample_content = [
                "src"
            ]
            with open(whitelist_file, 'w', encoding='utf-8') as f:
                f.write("\n".join(sample_content))
            print("promptsetup.whitelist file created with sample entries.")
        else:
            print("Continuing without a whitelist file. No files will be included.")

    # Delete ._ files if user wants
    delete_dot_underscore_files(base_dir)

    # Load whitelist patterns
    patterns = load_whitelist_patterns(whitelist_file)

    # Prepare output file (Markdown)
    output_file = os.path.join(base_dir, 'project_structure.md')
    structure, included_files = build_structure(base_dir, patterns)

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("this is my project, please read the contents and understand its functionality. once done, let me know and await my requests.\n\n")
        if not structure or (len(structure) == 1 and not structure['_files']):
            out.write("No directories or files are whitelisted.\n")
        else:
            # Handle root-level files
            if '_files' in structure and structure['_files']:
                out.write("`.` (Root)\n")
                out.write("==============\n")
                for fname in structure['_files']:
                    out.write(f"- `{fname}`\n")
                out.write("\n")
                del structure['_files']

            # Now handle directories
            for dirname in structure:
                out.write(f"`{dirname}`\n")
                out.write("==============\n")
                write_structure_md(structure[dirname], out, indent=1)

        # After printing entire structure, print code files
        code_files = [f for f in included_files if is_code_file(os.path.basename(f))]
        if code_files:
            out.write("\n## Included Files with Code\n\n")
            for fpath in code_files:
                rel_path = os.path.relpath(fpath, base_dir)
                out.write(f"### {rel_path}\n\n")
                out.write("``` \n")
                try:
                    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
                        for line in f:
                            out.write(line)
                except Exception:
                    out.write("Could not read file contents.\n")
                out.write("```\n\n")

    print(f"Project structure file generated: {output_file}")

if __name__ == "__main__":
    main()
