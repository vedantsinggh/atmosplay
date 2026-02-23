import os
import json

folder_path = './dataset/' 

try:
    contents = os.listdir(folder_path)
    for item in contents:
        if item.endswith(".json"):
            should_delete = False
            with open(os.path.join(folder_path, item), 'r') as file:
                    content = file.read()
                    data = json.loads(content)
                    if data["info"]["match_type"] != "ODI":
                        should_delete = True
            if should_delete:
                os.remove(os.path.join(folder_path, item))
        else:
            pass



except FileNotFoundError:
    print(f"Error: The path '{folder_path}' does not exist.")
except NotADirectoryError:
    print(f"Error: The path '{folder_path}' is not a directory.")
