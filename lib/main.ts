// main.ts
import { fs } from "./FileSystem";
import { MacInstaller } from "./Installer";

export async function bootSystem() {
  console.log("🔌 Powering on...");

  await fs.init();

  // Check for Critical Kernel Path to determine if installed
  const isInstalled = await fs.exists("/System/Library/CoreServices");

  if (!isInstalled) {
    const installer = new MacInstaller();
    await installer.install();
  } else {
    console.log(" macOS found. Booting Kernel...");
  }

  // Verification: List Root
  const rootFiles = await fs.ls("/");
  console.log("Root Directory Structure:", rootFiles);
}
