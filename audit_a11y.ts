import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const IGNORE_DIRS = ["node_modules", ".next", ".git", "dist", "build"];

function getAllTsxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getAllTsxFiles(filePath, fileList);
      }
    } else {
      if (file.endsWith(".tsx")) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
  snippet: string;
}

const violations: Violation[] = [];

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relativePath = path.relative(ROOT_DIR, filePath);

  // State for uniqueness checks within file
  const accessKeys = new Set<string>();
  const ariaIds = new Set<string>();

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // 1. Access Keys Unique
    const accessKeyMatch = line.match(/accessKey=["']([^"']+)["']/);
    if (accessKeyMatch) {
      const key = accessKeyMatch[1];
      if (accessKeys.has(key)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: "Unique Access Keys",
          message: `Duplicate accessKey "${key}" found.`,
          snippet: trimmed,
        });
      } else {
        accessKeys.add(key);
      }
    }

    // 2. Interactive Elements Names (Button, Link)
    // Simple check for buttons without content or aria-label
    if (
      /<button/.test(line) &&
      !/aria-label|aria-labelledby/.test(line) &&
      !/>.*<\/button>/.test(line) &&
      !/<\/button>/.test(line)
    ) {
      // This is a weak check because content might be on next line.
      // Better: check for self-closing button without label, or button opening tag without label
      if (
        /<button[^>]*\/>/.test(line) &&
        !/aria-label|aria-labelledby/.test(line)
      ) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: "Button Name",
          message:
            "Button element missing accessible name (aria-label/labelledby or content).",
          snippet: trimmed,
        });
      }
    }

    // 3. Dialogs
    if (
      /role=["'](dialog|alertdialog)["']/.test(line) &&
      !/aria-label|aria-labelledby/.test(line)
    ) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "Dialog Name",
        message:
          'Element with role="dialog" or "alertdialog" missing accessible name.',
        snippet: trimmed,
      });
    }

    // 4. Inputs
    if (/<input/.test(line)) {
      if (
        !/aria-label|aria-labelledby|id=|alt=/.test(line) &&
        !/type=["']hidden["']/.test(line)
      ) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: "Input Name",
          message:
            "Input element missing accessible name (aria-label, aria-labelledby, or id for label).",
          snippet: trimmed,
        });
      }
      // Input type image
      if (/type=["']image["']/.test(line) && !/alt=/.test(line)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: "Input Image Alt",
          message: 'Input type="image" missing alt text.',
          snippet: trimmed,
        });
      }
    }

    // 5. Images
    if (/<(img|Image)\s/.test(line) && !/alt=/.test(line)) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "Image Alt",
        message: "Image element missing alt attribute.",
        snippet: trimmed,
      });
    }

    // 6. TabIndex > 0
    if (
      /tabIndex=\{[1-9]\d*\}/.test(line) ||
      /tabIndex=["'][1-9]\d*["']/.test(line)
    ) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "TabIndex",
        message: "Avoid using positive tabIndex values.",
        snippet: trimmed,
      });
    }

    // 7. Video Captions
    if (/<video/.test(line)) {
      // This requires checking children, hard line-by-line.
      // We'll just flag it to check manually if we can't see track.
      // Skipping for now as regex is too weak for multi-line children.
    }

    // 8. Iframe Title
    if (/<iframe/.test(line) && !/title=/.test(line)) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "Frame Title",
        message: "Iframe missing title attribute.",
        snippet: trimmed,
      });
    }

    // 9. Html Lang (Only relevant for layout/html files)
    if (/<html/.test(line) && !/lang=/.test(line)) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "Html Lang",
        message: "Html element missing lang attribute.",
        snippet: trimmed,
      });
    }

    // 10. ARIA Hidden Focusable
    if (
      /aria-hidden=["']true["']/.test(line) &&
      /tabIndex|href|onClick|<button|<input|<select|<textarea/.test(line)
    ) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "Aria Hidden Focusable",
        message:
          'Element with aria-hidden="true" may contain focusable/interactive elements.',
        snippet: trimmed,
      });
    }

    // 11. ARIA Roles Names (meter, progressbar, etc)
    if (
      /role=["'](meter|progressbar|toggle|tooltip|treeitem)["']/.test(line) &&
      !/aria-label|aria-labelledby/.test(line)
    ) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: "ARIA Role Name",
        message: `Element with role missing accessible name.`,
        snippet: trimmed,
      });
    }
  });
}

console.log("Starting Accessibility Audit...");
const files = getAllTsxFiles(ROOT_DIR);
console.log(`Found ${files.length} .tsx files.`);

files.forEach(checkFile);

console.log("\n--- Audit Report ---");
if (violations.length === 0) {
  console.log("No obvious violations found (based on static regex analysis).");
} else {
  console.log(`Found ${violations.length} potential violations.`);

  // Group by file
  const byFile: Record<string, Violation[]> = {};
  violations.forEach((v) => {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  });

  Object.keys(byFile).forEach((file) => {
    console.log(`\nFile: ${file}`);
    byFile[file].forEach((v) => {
      console.log(`  [Line ${v.line}] ${v.rule}: ${v.message}`);
      console.log(`    Code: ${v.snippet}`);
    });
  });
}
