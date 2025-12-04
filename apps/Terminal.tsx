import React, { useState, useEffect, useRef } from "react";
import { fs } from "../lib/FileSystem";

interface TerminalProps {
  initialPath?: string;
}

import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import { TextEdit } from "./TextEdit";

export const Terminal: React.FC<TerminalProps> = ({ initialPath }) => {
  const { user } = useSystemStore();
  const { launchProcess } = useProcessStore();
  const userName = user?.name || "Guest";
  const userHome = `/Users/${userName}`;

  // Use initialPath if provided, otherwise default to userHome
  const startPath = initialPath || userHome;

  // Man Pages Data
  const manPages: Record<string, string> = {
    ls: "ls - list directory contents\n\nUsage: ls [options] [file|dir]\n\nOptions:\n  -a, --all      do not ignore entries starting with .\n  -l             use a long listing format",
    cd: "cd - change the shell working directory\n\nUsage: cd [dir]\n\nChange the current directory to DIR. The default DIR is the value of the HOME shell variable.",
    pwd: "pwd - print name of current/working directory\n\nUsage: pwd\n\nPrint the full filename of the current working directory.",
    mkdir:
      "mkdir - make directories\n\nUsage: mkdir [DIRECTORY]\n\nCreate the DIRECTORY(ies), if they do not already exist.",
    touch:
      "touch - change file timestamps\n\nUsage: touch [FILE]\n\nUpdate the access and modification times of each FILE to the current time. If FILE does not exist it is created empty.",
    echo: "echo - display a line of text\n\nUsage: echo [STRING]...\n\nEcho the STRING(s) to standard output.",
    cat: "cat - concatenate files and print on the standard output\n\nUsage: cat [FILE]...\n\nConcatenate FILE(s) to standard output.",
    clear: "clear - clear the terminal screen\n\nUsage: clear",
    whoami:
      "whoami - print effective userid\n\nUsage: whoami\n\nPrint the user name associated with the current effective user ID.",
    ping: "ping - send ICMP ECHO_REQUEST to network hosts\n\nUsage: ping [HOST]\n\nSend ICMP ECHO_REQUEST to network hosts.",
    man: "man - an interface to the system reference manuals\n\nUsage: man [COMMAND]\n\nDisplay the manual page for COMMAND.",
    rm: "rm - remove files or directories\n\nUsage: rm [OPTION]... [FILE]...\n\nRemove (unlink) the FILE(s).\n\nOptions:\n  -r, -R, --recursive   remove directories and their contents recursively\n  -f, --force           ignore nonexistent files and arguments, never prompt",
    rmdir:
      "rmdir - remove empty directories\n\nUsage: rmdir [DIRECTORY]...\n\nRemove the DIRECTORY(ies), if they are empty.",
    vi: "vi - screen-oriented (visual) display editor\n\nUsage: vi [FILE]\n\nEdit FILE.",
  };

  const [history, setHistory] = useState<(string | React.ReactNode)[]>([
    "Welcome to Terminal",
    "Type 'help' for a list of commands.",
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState(startPath);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const resolvePath = (path: string) => {
    if (!path) return currentPath;
    if (path.startsWith("/")) return path;
    if (path === "~") return userHome;
    if (path.startsWith("~/")) return path.replace("~", userHome);
    return `${currentPath}/${path}`.replace(/\/+/g, "/");
  };

  const handleCommand = async (cmd: string) => {
    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    let output: string | React.ReactNode | null = null;

    try {
      switch (command) {
        case "help":
          output =
            "Available commands: ls, cd, pwd, mkdir, touch, echo, cat, clear, whoami, ping, man, rm, rmdir, vi";
          break;
        case "clear":
          setHistory([]);
          return;
        case "pwd":
          output = currentPath;
          break;
        case "whoami":
          output = userName.toLowerCase();
          break;
        case "ping":
          if (!useSystemStore.getState().wifiEnabled) {
            output = `ping: cannot resolve ${args[0]}: Unknown host`;
          } else if (args[0]) {
            output = `PING ${args[0]} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.082 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.067 ms\n\n--- ${args[0]} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss`;
          } else {
            output = "usage: ping host";
          }
          break;
        case "man":
          if (args[0]) {
            if (manPages[args[0]]) {
              output = manPages[args[0]];
            } else {
              output = `No manual entry for ${args[0]}`;
            }
          } else {
            output = "What manual page do you want?";
          }
          break;
        case "ls":
          const showHidden = args.includes("-a") || args.includes("-la");
          const showDetails = args.includes("-l") || args.includes("-la");
          const pathArg = args.find((a) => !a.startsWith("-"));
          const targetPath = resolvePath(pathArg || "");

          if (await fs.exists(targetPath)) {
            const files = await fs.ls(targetPath);
            const filteredFiles = showHidden
              ? files
              : files.filter((f) => !f.isHidden);

            if (showDetails) {
              output = (
                <div className="flex flex-col">
                  {filteredFiles.map((f) => {
                    const perms =
                      f.kind === "directory" ? "drwxr-xr-x" : "-rw-r--r--";
                    const size = f.kind === "directory" ? "-" : "0"; // Mock size
                    const date = "Jan 1 00:00"; // Mock date
                    return (
                      <div key={f.name}>
                        {`${perms}  1 ${userName}  staff  ${size}  ${date}  `}
                        <span
                          className={
                            f.kind === "directory"
                              ? "text-blue-400 font-bold"
                              : "text-white"
                          }
                        >
                          {f.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            } else {
              output = (
                <div className="flex flex-wrap gap-4">
                  {filteredFiles.map((f) => (
                    <span
                      key={f.name}
                      className={
                        f.kind === "directory"
                          ? "text-blue-400 font-bold"
                          : "text-white"
                      }
                    >
                      {f.name}
                      {f.kind === "directory" ? "/" : ""}
                    </span>
                  ))}
                </div>
              );
            }
          } else {
            output = `ls: ${pathArg || ""}: No such file or directory`;
          }
          break;
        case "cd":
          const cdPath = args[0] || userHome;
          const resolvedCdPath = resolvePath(cdPath);

          // Handle .. manually for now since resolvePath is simple
          // A real path resolver would handle .. better
          const normalizedPath = resolvedCdPath
            .split("/")
            .reduce((acc, part) => {
              if (part === "..") acc.pop();
              else if (part !== "." && part !== "") acc.push(part);
              return acc;
            }, [] as string[])
            .join("/");

          const finalPath = "/" + normalizedPath;

          if (await fs.exists(finalPath)) {
            try {
              // Verify it is a directory by trying to list it
              await fs.ls(finalPath);
              setCurrentPath(finalPath);
            } catch {
              output = `cd: ${args[0]}: Not a directory`;
            }
          } else {
            output = `cd: ${args[0]}: No such file or directory`;
          }
          break;
        case "mkdir":
          if (args[0]) {
            await fs.mkdir(resolvePath(args[0]));
          } else {
            output = "usage: mkdir directory_name";
          }
          break;
        case "rmdir":
          if (args[0]) {
            const dirPath = resolvePath(args[0]);
            if (await fs.exists(dirPath)) {
              // Check if empty
              const files = await fs.ls(dirPath);
              if (files.length === 0) {
                await fs.delete(
                  dirPath.substring(0, dirPath.lastIndexOf("/")),
                  dirPath.split("/").pop()!
                );
              } else {
                output = `rmdir: ${args[0]}: Directory not empty`;
              }
            } else {
              output = `rmdir: ${args[0]}: No such file or directory`;
            }
          } else {
            output = "usage: rmdir directory_name";
          }
          break;
        case "rm":
          const isRecursive = args.includes("-rf") || args.includes("-r");
          const rmPathArg = args.find((a) => !a.startsWith("-"));

          if (rmPathArg) {
            const targetRmPath = resolvePath(rmPathArg);
            if (await fs.exists(targetRmPath)) {
              // If it's a directory and not recursive, fail
              // We need to check if it is a directory. fs.ls works on dirs.
              let isDir = false;
              try {
                await fs.ls(targetRmPath);
                isDir = true;
              } catch {}

              if (isDir && !isRecursive) {
                output = `rm: ${rmPathArg}: is a directory`;
              } else {
                await fs.delete(
                  targetRmPath.substring(0, targetRmPath.lastIndexOf("/")),
                  targetRmPath.split("/").pop()!
                );
              }
            } else {
              output = `rm: ${rmPathArg}: No such file or directory`;
            }
          } else {
            output = "usage: rm [-rf] file_name";
          }
          break;
        case "touch":
          if (args[0]) {
            const newFile = resolvePath(args[0]);
            await fs.writeFile(
              newFile.substring(0, newFile.lastIndexOf("/")),
              newFile.split("/").pop()!,
              ""
            );
          } else {
            output = "usage: touch file_name";
          }
          break;
        case "echo":
          output = args.join(" ");
          break;
        case "cat":
          if (args[0]) {
            const targetFile = resolvePath(args[0]);
            const lastSlash = targetFile.lastIndexOf("/");
            const path = targetFile.substring(0, lastSlash);
            const name = targetFile.substring(lastSlash + 1);

            if (await fs.exists(targetFile)) {
              output = await fs.readFile(path, name);
            } else {
              output = `cat: ${args[0]}: No such file or directory`;
            }
          } else {
            output = "usage: cat file_name";
          }
          break;
        case "vi":
        case "vim":
        case "nano":
          if (args[0]) {
            const targetFile = resolvePath(args[0]);
            const path = targetFile.substring(0, targetFile.lastIndexOf("/"));
            const filename = targetFile.split("/").pop()!;

            // Create file if it doesn't exist
            if (!(await fs.exists(targetFile))) {
              await fs.writeFile(path, filename, "");
            }

            launchProcess(
              "textedit",
              "TextEdit",
              "📝",
              <TextEdit initialPath={path} initialFilename={filename} />
            );
            output = `Opening ${args[0]} in TextEdit...`;
          } else {
            output = "usage: vi file_name";
          }
          break;
        case "":
          break;
        default:
          output = `command not found: ${command}`;
      }
    } catch (e) {
      output = `Error: ${(e as Error).message}`;
    }

    setHistory((prev) => [
      ...prev,
      `${currentPath} $ ${cmd}`,
      ...(output ? [output] : []),
    ]);
  };

  return (
    <div
      className="h-full w-full bg-black/90 text-green-400 font-mono text-sm p-2 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap wrap-break-word">
          {line}
        </div>
      ))}
      <div className="flex">
        <span className="mr-2 text-blue-400">{currentPath} $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(input);
              setInput("");
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (commandHistory.length > 0) {
                const newIndex =
                  historyIndex === -1
                    ? commandHistory.length - 1
                    : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                  const newIndex = historyIndex + 1;
                  setHistoryIndex(newIndex);
                  setInput(commandHistory[newIndex]);
                } else {
                  setHistoryIndex(-1);
                  setInput("");
                }
              }
            }
          }}
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          aria-label="Terminal Input"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
