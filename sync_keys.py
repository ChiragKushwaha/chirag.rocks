import json
import glob
import os
import sys

def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return None

def save_json(path, data):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error writing {path}: {e}")

def deep_merge_missing(source, target, path=""):
    """
    Recursively adds keys from source to target if they are missing in target.
    Returns True if any changes were made.
    """
    changed = False
    for key, value in source.items():
        current_path = f"{path}.{key}" if path else key
        
        if key not in target:
            target[key] = value
            changed = True
        elif isinstance(value, dict):
            if key in target and not isinstance(target[key], dict):
                 # Conflict: Source is dict, target is not. 
                 # We must overwrite to match en.json structure.
                 target[key] = value
                 changed = True
                 print(f"    ! Overwrote type mismatch at {current_path}: target {type(target[key])} -> dict")
                 continue
            
            if deep_merge_missing(value, target[key], current_path):
                changed = True
    return changed

def main():
    en_path = 'messages/en.json'
    en_data = load_json(en_path)
    if not en_data:
        sys.exit(1)

    for fpath in glob.glob('messages/*.json'):
        if fpath.endswith('en.json'): continue
        
        print(f"Processing {fpath}...")
        data = load_json(fpath)
        if not data: continue
        
        # Fill Missing Keys (including new SEO keys)
        filled = deep_merge_missing(en_data, data)
        
        if filled:
            save_json(fpath, data)
            print(f"  - Updated {fpath}")
        else:
            print(f"  - No changes needed for {fpath}")

if __name__ == "__main__":
    main()
