"use client";

import { useCallback, useRef, useState } from "react";
import {
  createFileSystem,
  Directory,
  FileSystem,
  TERMINAL_COMMANDS,
} from "@/constants/terminal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LineType = "input" | "output" | "error" | "boot" | "dir";

export type OutputLine = {
  id: string;
  type: LineType;
  text: string;
  // Path captured at command execution time so history lines always show the
  // directory the command was run from, even after a subsequent cd.
  path?: string;
};

export type CommandResult =
  | { action: "none" | "exit" }
  | { action: "navigate"; navigateTo: string };

export type UseTerminalReturn = {
  lines: OutputLine[];
  currentPath: string;
  initSession: () => void;
  resetSession: () => void;
  executeCommand: (input: string) => CommandResult;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let lineCounter = 0;

function makeLine(type: LineType, text: string, path?: string): OutputLine {
  return { id: `l${++lineCounter}`, type, text, path };
}

const inputLine  = (cmd: string, path: string) => makeLine("input",  cmd, path);
const outputLine = (text: string) => makeLine("output", text);
const errorLine  = (text: string) => makeLine("error",  text);
const dirLine    = (text: string) => makeLine("dir",    text);
const bootLine   = (text: string) => makeLine("boot",   text);

// ─── Boot message ─────────────────────────────────────────────────────────────

// TODO: replace with a custom boot sequence — placeholder for now
// Called each initSession so every line gets a fresh unique ID.
function makeBootLines(): OutputLine[] {
  return [bootLine("Welcome to my terminal.")];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTerminal(): UseTerminalReturn {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [cwdPath, setCwdPath] = useState("~");

  // FileSystem instance lives in a ref — mutations don't trigger re-renders.
  // Only the derived cwdPath (via setCwdPath) drives UI updates.
  const fsRef = useRef<FileSystem>(createFileSystem());
  const isBootedRef = useRef(false);

  const syncCwd = useCallback(() => {
    setCwdPath(fsRef.current.pwd());
  }, []);

  const initSession = useCallback(() => {
    if (isBootedRef.current) return;
    isBootedRef.current = true;
    setLines([
      ...makeBootLines(),
      outputLine(""),
      bootLine("// type 'help' to see available commands"),
    ]);
  }, []);

  const resetSession = useCallback(() => {
    isBootedRef.current = false;
    setLines([]);
    fsRef.current = createFileSystem();
    setCwdPath("~");
  }, []);

  const executeCommand = useCallback(
    (raw: string): CommandResult => {
      const trimmed = raw.trim();
      if (!trimmed) return { action: "none" };

      const fs = fsRef.current;
      const pathAtExecution = fs.pwd();
      const [cmd, ...args] = trimmed.split(/\s+/);

      switch (cmd.toLowerCase()) {
        // ── help ──────────────────────────────────────────────────────────
        case "help":
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine(""),
            outputLine("available commands:"),
            outputLine(""),
            ...Object.entries(TERMINAL_COMMANDS).map(([c, desc]) =>
              outputLine(`  ${c.padEnd(22)}${desc}`),
            ),
            outputLine(""),
          ]);
          return { action: "none" };

        // ── ls ────────────────────────────────────────────────────────────
        case "ls": {
          const target = args[0];
          let dir: Directory;

          if (target) {
            const node = fs.resolve(target);
            if (!node || node.type !== "directory") {
              setLines((prev) => [
                ...prev,
                inputLine(trimmed, pathAtExecution),
                errorLine(`ls: ${target}: no such directory`),
              ]);
              return { action: "none" };
            }
            dir = node;
          } else {
            dir = fs.getCwd();
          }

          const entries = dir.list();
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            entries.length > 0 ? dirLine(entries.join("    ")) : outputLine(""),
          ]);
          return { action: "none" };
        }

        // ── pwd ───────────────────────────────────────────────────────────
        case "pwd":
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine(pathAtExecution),
          ]);
          return { action: "none" };

        // ── cat ───────────────────────────────────────────────────────────
        case "cat": {
          const filePath = args[0];
          if (!filePath) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine("cat: missing file operand"),
            ]);
            return { action: "none" };
          }

          const node = fs.resolve(filePath);

          if (!node) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`cat: ${filePath}: no such file`),
            ]);
            return { action: "none" };
          }

          if (node.type === "directory") {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`cat: ${filePath}: is a directory`),
            ]);
            return { action: "none" };
          }

          const content = node.read();
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine(""),
            ...content.split("\n").map((line) => outputLine(line)),
            outputLine(""),
          ]);
          return { action: "none" };
        }

        // ── cd ────────────────────────────────────────────────────────────
        case "cd": {
          const target = args[0];

          // cd with no args or cd ~ → root
          if (!target || target === "~") {
            fs.cd("~");
            syncCwd();
            setLines((prev) => [...prev, inputLine(trimmed, pathAtExecution)]);
            return { action: "none" };
          }

          const node = fs.resolve(target);

          if (!node || node.type !== "directory") {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`cd: ${target}: no such directory`),
            ]);
            return { action: "none" };
          }

          fs.cd(target);
          syncCwd();
          setLines((prev) => [...prev, inputLine(trimmed, pathAtExecution)]);
          return { action: "none" };
        }

        // ── open ──────────────────────────────────────────────────────────
        case "open": {
          const target = args[0];
          if (!target) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine("open: missing directory operand"),
            ]);
            return { action: "none" };
          }

          const node = fs.resolve(target);

          if (!node || node.type !== "directory") {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`open: ${target}: no such directory`),
            ]);
            return { action: "none" };
          }

          if (!node.navigateTo) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`open: ${target}: no linked page`),
            ]);
            return { action: "none" };
          }

          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine(`→ opening ${node.navigateTo} ...`),
          ]);
          return { action: "navigate", navigateTo: node.navigateTo };
        }

        // ── clear ─────────────────────────────────────────────────────────
        case "clear":
          setLines([]);
          return { action: "none" };

        // ── exit ──────────────────────────────────────────────────────────
        case "exit":
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine("Goodbye."),
          ]);
          return { action: "exit" };

        // ── unknown ───────────────────────────────────────────────────────
        default:
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            errorLine(`${cmd}: command not found`),
            outputLine("  type 'help' to see available commands"),
          ]);
          return { action: "none" };
      }
    },
    [syncCwd],
  );

  return { lines, currentPath: cwdPath, initSession, resetSession, executeCommand };
}
