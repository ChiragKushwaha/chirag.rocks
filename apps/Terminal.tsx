import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { fs } from "../lib/FileSystem";

interface TerminalProps {
  initialPath?: string;
}

import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import { TextEdit } from "./TextEdit";

export const Terminal: React.FC<TerminalProps> = ({ initialPath }) => {
  const t = useTranslations("Terminal");
  const { user } = useSystemStore();
  const { launchProcess } = useProcessStore();
  const userName = user?.name || t("Guest");
  const userHome = `/Users/${userName}`;

  // Use initialPath if provided, otherwise default to userHome
  const startPath = initialPath || userHome;

  // Man Pages Data
  const manPages: Record<string, string> = {
    ls: t("ManPages.ls"),
    cd: t("ManPages.cd"),
    pwd: t("ManPages.pwd"),
    mkdir: t("ManPages.mkdir"),
    touch: t("ManPages.touch"),
    echo: t("ManPages.echo"),
    cat: t("ManPages.cat"),
    clear: t("ManPages.clear"),
    whoami: t("ManPages.whoami"),
    ping: t("ManPages.ping"),
    man: t("ManPages.man"),
    rm: t("ManPages.rm"),
    rmdir: t("ManPages.rmdir"),
    vi: t("ManPages.vi"),
  };

  const [history, setHistory] = useState<(string | React.ReactNode)[]>([
    t("Welcome"),
    t("HelpPrompt"),
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
        case "help":
          output = t("AvailableCommands");
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
            output = t("Errors.PingResolve", { host: args[0] });
          } else if (args[0]) {
            output = t("Messages.PingStats", { host: args[0] });
          } else {
            output = t("Usage.Ping");
          }
          break;
        case "man":
          if (args[0]) {
            if (manPages[args[0]]) {
              output = manPages[args[0]];
            } else {
              output = t("Errors.NoManual", { command: args[0] });
            }
          } else {
            output = t("Usage.Man");
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
            output = t("Errors.NoSuchFile", { cmd: "ls", path: pathArg || "" });
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
              await fs.ls(finalPath);
              setCurrentPath(finalPath);
            } catch {
              output = t("Errors.NotADirectory", { cmd: "cd", path: args[0] });
            }
          } else {
            output = t("Errors.NoSuchFile", { cmd: "cd", path: args[0] });
          }
          break;
        case "mkdir":
          if (args[0]) {
            await fs.mkdir(resolvePath(args[0]));
          } else {
            output = t("Usage.Mkdir");
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
                output = t("Errors.DirectoryNotEmpty", {
                  cmd: "rmdir",
                  path: args[0],
                });
              }
            } else {
              output = t("Errors.NoSuchFile", { cmd: "rmdir", path: args[0] });
            }
          } else {
            output = t("Usage.Rmdir");
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
                output = t("Errors.IsADirectory", {
                  cmd: "rm",
                  path: rmPathArg,
                });
              } else {
                await fs.delete(
                  targetRmPath.substring(0, targetRmPath.lastIndexOf("/")),
                  targetRmPath.split("/").pop()!
                );
              }
            } else {
              output = t("Errors.NoSuchFile", { cmd: "rm", path: rmPathArg });
            }
          } else {
            output = t("Usage.Rm");
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
            output = t("Usage.Touch");
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
              output = t("Errors.NoSuchFile", { cmd: "cat", path: args[0] });
            }
          } else {
            output = t("Usage.Cat");
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

            output = t("Messages.OpeningTextEdit", { file: args[0] });
          } else {
            output = t("Usage.Vi");
          }
          break;
        case "":
          break;
        default:
          output = t("CommandNotFound", { command: command });
      }
    } catch (e) {
      output = t("Error", { message: (e as Error).message });
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
          aria-label={t("AriaInput")}
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
