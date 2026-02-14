# # v1 : should run only inside /src/content/post path.
# import os
# import shutil
# from pathlib import Path

# ROOT_DIR = Path.cwd()          # directory where you run the script
# IMG_FILE = "img.png"           # file to copy
# TARGET_SUBDIR = "eng"          # sub-folder to create in every directory

# for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
#     # skip the top-level folder itself
#     if Path(dirpath) == ROOT_DIR:
#         continue

#     img_path = Path(dirpath) / IMG_FILE
#     eng_path = Path(dirpath) / TARGET_SUBDIR
#     dest_img = eng_path / IMG_FILE

#     # create "eng" folder if it doesn't exist
#     eng_path.mkdir(exist_ok=True)

#     # copy img.png only if it exists in current folder and not already in eng/
#     if img_path.is_file() and not dest_img.exists():
#         shutil.copy2(img_path, dest_img)





# # v2 : only  move img and create eng folder
# import os
# import shutil
# from pathlib import Path

# ROOT_DIR = Path("./src/content/post")   # only this tree is scanned
# IMG_FILE = "img.png"
# TARGET_SUBDIR = "eng"

# # only first-level sub-folders
# for entry in ROOT_DIR.iterdir():
#     if not entry.is_dir():
#         continue

#     img_path = entry / IMG_FILE
#     eng_path = entry / TARGET_SUBDIR
#     dest_img = eng_path / IMG_FILE

#     eng_path.mkdir(exist_ok=True)

#     if img_path.is_file() and not dest_img.exists():
#         shutil.copy2(img_path, dest_img)






# v3 : also create blank index.md if not exists
# distribute_img.py
import shutil
from pathlib import Path

ROOT_DIR = Path("./src/content/post")
IMG_FILE = "img.png"
TARGET_SUBDIR = "eng"
INDEX_FILE = "index.md"

for entry in ROOT_DIR.iterdir():
    if not entry.is_dir():
        continue

    # handle img.png
    img_path = entry / IMG_FILE
    eng_path = entry / TARGET_SUBDIR
    dest_img = eng_path / IMG_FILE
    eng_path.mkdir(exist_ok=True)
    if img_path.is_file() and not dest_img.exists():
        shutil.copy2(img_path, dest_img)

    # create index.md only inside the sub-folder
    index_path = entry / INDEX_FILE
    if not index_path.exists():
        index_path.touch()

