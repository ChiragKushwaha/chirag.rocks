// Installer.ts
import { fs } from "./FileSystem";
import { SymlinkConfig } from "./types";

export class MacInstaller {
  // 1. The Unix Subsystem (Hidden)
  private unixDirs: string[] = [
    "/bin",
    "/sbin",
    "/dev",
    "/etc",
    "/tmp",
    "/var",
    "/usr/bin",
    "/usr/sbin",
    "/usr/lib",
    "/usr/local/bin",
    "/private/var/log",
    "/private/var/tmp",
    "/private/etc",
    "/private/tmp",
    "/opt/homebrew",
    "/cores",
  ];

  // 2. The Apple System (Read Only)
  private systemDirs: string[] = [
    "/System/Library/CoreServices",
    "/System/Library/Fonts",
    "/System/Library/Frameworks",
    "/System/Library/PreferencePanes",
    "/System/Library/Sounds",
    "/Library/Application Support",
    "/Library/Audio/Plug-Ins",
    "/Library/Desktop Pictures",
    "/Library/Fonts",
    "/Library/Preferences",
    "/Volumes/Macintosh HD",
  ];

  // 3. User Land
  private userDirs: string[] = [
    "/Applications",
    "/Applications/Utilities",
    "/Users/Shared",
    "/Users/Guest/Desktop",
    "/Users/Guest/Documents",
    "/Users/Guest/Downloads",
    "/Users/Guest/Movies",
    "/Users/Guest/Music",
    "/Users/Guest/Pictures",
    "/Users/Guest/Public",
    "/Users/Guest/Library/Application Support",
    "/Users/Guest/Library/Preferences",
  ];

  // 4. Symbolic Links (Simulated)
  private symlinks: SymlinkConfig[] = [
    { path: "/var", target: "/private/var" },
    { path: "/etc", target: "/private/etc" },
    { path: "/tmp", target: "/private/tmp" },
  ];

  public async install(): Promise<void> {
    console.log("🍏 Starting macOS Factory Installation...");

    const allDirs = [...this.unixDirs, ...this.systemDirs, ...this.userDirs];

    // Create Folders
    for (const dir of allDirs) {
      await fs.mkdir(dir);
    }

    // Create Symlink Metadata
    for (const link of this.symlinks) {
      // We ensure the folder exists so it can be 'entered'
      await fs.mkdir(link.path);
      // We drop a hidden file inside to tell the OS it's a link
      await fs.writeFile(link.path, ".symlink", link.target);
    }

    // Create System Identity
    await fs.writeFile(
      "/System/Library/CoreServices",
      "SystemVersion.plist",
      `<dict>
        <key>ProductName</key><string>macOS</string>
        <key>ProductVersion</key><string>14.4.1 (Sonoma)</string>
        <key>BuildVersion</key><string>23E224</string>
      </dict>`
    );

    // Create Hosts
    await fs.writeFile(
      "/private/etc",
      "hosts",
      "127.0.0.1\tlocalhost\n255.255.255.255\tbroadcast"
    );

    // Create User Welcome File
    await fs.writeFile(
      "/Users/Guest/Desktop",
      "Welcome.txt",
      "Welcome to the Web-Based Mac Simulation."
    );

    console.log("✅ Installation Complete.");
  }
}
