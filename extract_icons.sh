#!/bin/bash
mkdir -p public/icons

# Function to convert icns to png
convert_icon() {
    app_path="$1"
    icon_name="$2"
    
    if [ -d "$app_path" ]; then
        # Find .icns file in Resources
        icns_file=$(find "$app_path/Contents/Resources" -name "*.icns" -maxdepth 1 | head -n 1)
        if [ -n "$icns_file" ]; then
            echo "Extracting $icon_name from $icns_file..."
            # Convert to 128x128 png (standard size for web use)
            sips -s format png -z 128 128 "$icns_file" --out "public/icons/$icon_name.png" > /dev/null 2>&1
        else
            echo "No icns found for $icon_name"
        fi
    else
        # echo "App not found: $app_path"
        :
    fi
}

# Function to process a directory of apps
process_directory() {
    dir_path="$1"
    echo "Processing $dir_path..."
    
    # Check if directory exists
    if [ -d "$dir_path" ]; then
        # Loop through .app bundles
        for app in "$dir_path"/*.app; do
            if [ -d "$app" ]; then
                app_name=$(basename "$app" .app)
                # Sanitize name: lowercase, remove spaces/special chars
                safe_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g')
                
                convert_icon "$app" "$safe_name"
            fi
        done
    fi
}

# 1. Extract specific system apps with preferred names (overwrites generic ones later if needed, or we can do this first)
# We do this first to ensure 'finder', 'launchpad' etc have the simple names we expect in our code
convert_icon "/System/Applications/Finder.app" "finder"
convert_icon "/System/Applications/Launchpad.app" "launchpad"
convert_icon "/System/Applications/Safari.app" "safari"
convert_icon "/System/Applications/Messages.app" "messages"
convert_icon "/System/Applications/Mail.app" "mail"
convert_icon "/System/Applications/Maps.app" "maps"
convert_icon "/System/Applications/Photos.app" "photos"
convert_icon "/System/Applications/FaceTime.app" "facetime"
convert_icon "/System/Applications/Calendar.app" "calendar"
convert_icon "/System/Applications/Contacts.app" "contacts"
convert_icon "/System/Applications/Reminders.app" "reminders"
convert_icon "/System/Applications/Notes.app" "notes"
convert_icon "/System/Applications/Music.app" "music"
convert_icon "/System/Applications/Podcasts.app" "podcasts"
convert_icon "/System/Applications/TV.app" "tv"
convert_icon "/System/Applications/App Store.app" "appstore"
convert_icon "/System/Applications/System Settings.app" "settings"
convert_icon "/System/Applications/Utilities/Terminal.app" "terminal"
convert_icon "/System/Applications/Calculator.app" "calculator"

# 2. Extract ALL apps from standard locations
process_directory "/System/Applications"
process_directory "/System/Applications/Utilities"
process_directory "/Applications"
process_directory "/System/Library/CoreServices" # Finder is here usually, but we handled it manually above

echo "Icon extraction complete."
