import os

def list_files(startpath):
    ignored_dirs = {"venv", "__pycache__", "node_modules", "build"}

    for root, dirs, files in os.walk(startpath):
        # Exclure les répertoires ignorés
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print('{}{}/'.format(indent, os.path.basename(root)))
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print('{}{}'.format(subindent, f))

if __name__ == "__main__":
    list_files('.')
