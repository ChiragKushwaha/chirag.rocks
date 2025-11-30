#!/bin/bash
mkdir -p public/assets

# Function to copy file and maintain structure
copy_asset() {
    src="$1"
    # Remove leading slash for relative path in public/assets
    rel_path="${src#/}"
    dest="public/assets/$rel_path"
    
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "Copied $src"
}

# 1. Extract Wallpapers (ALL)
echo "Extracting Wallpapers..."
# Copying .heic, .jpg, .png files.
find "/System/Library/Desktop Pictures" -maxdepth 1 \( -name "*.heic" -o -name "*.jpg" -o -name "*.png" \) | while read file; do
    copy_asset "$file"
done

# 2. Extract SF Fonts (ALL SF*)
echo "Extracting Fonts..."
find "/System/Library/Fonts" -name "SF*.ttf" -o -name "SF*.ttc" | while read file; do
    copy_asset "$file"
done

# Generate Manifest
echo "Generating asset_manifest.json..."
echo "[" > public/assets/manifest.json
first=true
# Find all files in public/assets, excluding manifest.json and .DS_Store
find public/assets -type f -not -name "manifest.json" -not -name ".DS_Store" | while read file; do
    # Get path relative to public/assets
    # file is like public/assets/System/Library/...
    # we want /System/Library/...
    rel_path="${file#public/assets}"
    
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> public/assets/manifest.json
    fi
    echo "  \"$rel_path\"" >> public/assets/manifest.json
done
echo "]" >> public/assets/manifest.json

echo "Asset extraction complete."
