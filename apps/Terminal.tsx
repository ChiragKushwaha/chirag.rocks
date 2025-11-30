import React, { useState, useEffect, useRef } from "react";
import { fs } from "../lib/FileSystem";

interface TerminalProps {
  initialPath?: string;
}

import { useSystemStore } from "../store/systemStore";

export const Terminal: React.FC<TerminalProps> = ({ initialPath }) => {
  const { user } = useSystemStore();
  const userName = user?.name || "Guest";
  const userHome = `/Users/${userName}`;

  // Use initialPath if provided, otherwise default to userHome
  const startPath = initialPath || userHome;

  const [history, setHistory] = useState<string[]>([
    "Welcome to Terminal",
    "Type 'help' for a list of commands.",
  ]);
  const [currentPath, setCurrentPath] = useState(startPath);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    let output: string | null = null;

    try {
      switch (command) {
        case "help":
          output =
            "Available commands: ls, cd, pwd, mkdir, touch, echo, cat, clear, whoami";
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
        case "ls":
          const targetPath = args[0]
            ? args[0].startsWith("/")
              ? args[0]
              : `${currentPath}/${args[0]}`.replace(/\/+/g, "/")
            : currentPath;

          if (await fs.exists(targetPath)) {
            const files = await fs.ls(targetPath);
            output = files
              .map((f) => f.name + (f.kind === "directory" ? "/" : ""))
              .join("  ");
          } else {
            output = `ls: ${args[0]}: No such file or directory`;
          }
          break;
        case "cd":
          if (!args[0]) {
            setCurrentPath(userHome);
          } else {
            const newPath = args[0].startsWith("/")
              ? args[0]
              : `${currentPath}/${args[0]}`.replace(/\/+/g, "/");

            // Handle .. for parent directory
            // A simple normalization for .. (not robust for all cases but good for basic usage)
            const normalizedPath = newPath
              .split("/")
              .reduce((acc, part) => {
                if (part === "..") acc.pop();
                else if (part !== "." && part !== "") acc.push(part);
                return acc;
              }, [] as string[])
              .join("/");

            const finalPath = "/" + normalizedPath;

            if (await fs.exists(finalPath)) {
              // Check if it's a directory (fs.ls works on directories)
              // Ideally fs.stat would tell us, but for now we assume if we can ls it, it's a dir
              // Or we can try to ls it and catch error
              try {
                await fs.ls(finalPath);
                setCurrentPath(finalPath);
              } catch {
                output = `cd: ${args[0]}: Not a directory`;
              }
            } else {
              output = `cd: ${args[0]}: No such file or directory`;
            }
          }
          break;
        case "mkdir":
          if (args[0]) {
            const newDir = args[0].startsWith("/")
              ? args[0]
              : `${currentPath}/${args[0]}`;
            await fs.mkdir(newDir);
          } else {
            output = "usage: mkdir directory_name";
          }
          break;
        case "touch":
          if (args[0]) {
            const newFile = args[0].startsWith("/")
              ? args[0]
              : `${currentPath}/${args[0]}`;
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
            const targetFile = args[0].startsWith("/")
              ? args[0]
              : `${currentPath}/${args[0]}`;
            // Need to split path and filename for readFile
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
        case "":
          break;
        default:
          output = `command not found: ${command}`;
      }
    } catch (e: any) {
      output = `Error: ${e.message}`;
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
        <div key={i} className="whitespace-pre-wrap break-words">
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
            }
          }}
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
