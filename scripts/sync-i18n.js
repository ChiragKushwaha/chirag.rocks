const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const enPath = path.join(messagesDir, 'en.json');

const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to deep merge objects
function mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                }
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// Get all json files
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

files.forEach(file => {
    const filePath = path.join(messagesDir, file);
    console.log(`Syncing ${file}...`);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newContent = mergeDeep(content, enContent); // Note: this might overwrite if I flip args. I want to keep existing translations.
        // Actually, mergeDeep(target, source) as written above:
        // If key in target (existing translation), keep it.
        // If key not in target, take from source (English).
        // So target=content, source=enContent.

        // Let's refine the merge logic to be safer and clearer.
        // We want: keys from EN that are missing in Lang to be added.
        // Keys present in Lang should be preserved.

        const merged = syncKeys(content, enContent);

        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    } catch (e) {
        console.error(`Error syncing ${file}:`, e);
    }
});

function syncKeys(local, source) {
    const result = { ...local };

    // Add missing keys from source
    for (const key in source) {
        if (isObject(source[key])) {
            if (!result[key] || !isObject(result[key])) {
                // Entire object missing or type mismatch, copy from source
                result[key] = source[key];
            } else {
                // Recurse
                result[key] = syncKeys(result[key], source[key]);
            }
        } else {
            // Primitive value
            if (result[key] === undefined) {
                result[key] = source[key];
            }
        }
    }

    return result;
}

console.log('Sync complete.');
