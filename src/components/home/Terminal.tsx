"use client";

import {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { VscClose, VscChromeMinimize } from "react-icons/vsc";
import { MdOpenInFull, MdCloseFullscreen } from "react-icons/md";
import { cn } from "@/utils/cn";
import { createFileSystem, FileSystem, Directory } from "@/lib/terminal-fs";
import { TERMINAL_HOSTNAME, TERMINAL_COMMANDS } from "@/constants/terminal";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineType = "input" | "output" | "error" | "boot" | "dir";

type OutputLine = {
  type: LineType;
  text: string;
  // Path captured at command execution time so history lines always show the
  // directory the command was run from, even after a subsequent cd.
  path?: string;
};

type CommandResult =
  | { action: "none" | "exit" }
  | { action: "navigate"; navigateTo: string };

type TerminalState = "closed" | "panel" | "fullscreen" | "minimised";

export type TerminalMode = "panel" | "fullscreen";

export interface TerminalProps {
  isDesktop: boolean;
  openTrigger: number;
  // Mode in which to open when triggered — nav button uses "panel", hero button uses "fullscreen"
  openMode: TerminalMode;
}

interface TerminalWindowProps {
  lines: OutputLine[];
  inputValue: string;
  isFullscreen: boolean;
  currentPath: string;
  outputRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onMinimise: () => void;
  onToggleFullscreen: () => void;
}

// ─── Line helpers ─────────────────────────────────────────────────────────────

function makeLine(type: LineType, text: string, path?: string): OutputLine {
  return { type, text, path };
}

const inputLine = (cmd: string, path: string) => makeLine("input", cmd, path);
const outputLine = (text: string) => makeLine("output", text);
const errorLine = (text: string) => makeLine("error", text);
const dirLine = (text: string) => makeLine("dir", text);
const bootLine = (text: string) => makeLine("boot", text);

// ─── Boot message ─────────────────────────────────────────────────────────────

// TODO: replace with a custom boot sequence — placeholder for now
// Called each initSession so every line gets a fresh unique ID.
function makeBootLines(): OutputLine[] {
  return [bootLine("Welcome to my terminal.")];
}

// ─── Output span primitives ───────────────────────────────────────────────────

const PromptHost = () => (
  <span className="text-(--term-prompt)">{TERMINAL_HOSTNAME}</span>
);
const PromptPath = (text: string) => (
  <span className="text-(--term-path)">{text}</span>
);
const PromptPrefix = (path: string) => (
  <>
    {PromptHost()}
    {OutputText(":")}
    {PromptPath(path)}
    {OutputText("$ ")}
  </>
);
const OutputText = (text: string) => (
  <span className="text-(--term-white)">{text}</span>
);
const ErrorText = (text: string) => (
  <span className="text-(--term-error)">{text}</span>
);
const BootText = (text: string) => (
  <span className="text-(--text-muted)">{text}</span>
);
const DirText = (text: string) => (
  <span className="text-(--term-path) font-bold">{text}</span>
);

// ─── TerminalWindow ───────────────────────────────────────────────────────────
// Purely presentational — renders the titlebar, output area, and prompt input.
// Receives all data and handlers as props; owns no state of its own.

function TerminalWindow({
  lines,
  inputValue,
  isFullscreen,
  currentPath,
  outputRef,
  inputRef,
  onInputChange,
  onKeyDown,
  onClose,
  onMinimise,
  onToggleFullscreen,
}: TerminalWindowProps) {
  return (
    <>
      {/* macOS-style titlebar — dots left, path centred */}
      <div className="flex items-center justify-between px-3 py-[9px] [border-bottom:0.5px_solid_rgba(175,169,236,0.08)] shrink-0">
        <div className="flex items-center gap-[6px]">
          <button
            onClick={onClose}
            className="group relative w-3 h-3 rounded-full bg-[#ff5f57] hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Close terminal"
          >
            <VscClose className="absolute text-[8px] text-black/90 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={onMinimise}
            className="group relative w-3 h-3 rounded-full bg-[#febc2e] hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Minimise terminal"
          >
            <VscChromeMinimize className="absolute text-[8px] text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={onToggleFullscreen}
            className="group relative w-3 h-3 rounded-full bg-[#28c840] hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <MdCloseFullscreen className="absolute text-[8px] text-black/90 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
            ) : (
              <MdOpenInFull className="absolute text-[8px] text-black/90 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
            )}
          </button>
        </div>

        <span className="font-mono text-[11px] text-(--text-dim)">
          {currentPath}
        </span>

        {/* Mirrors the dots cluster width so the path appears visually centred */}
        <div className="w-[54px]" />
      </div>

      {/* Scrollable output — clicking anywhere in the output area focuses the input,
          matching the behaviour of a real terminal emulator */}
      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-auto px-3 py-2 font-mono text-[12px] leading-[1.75] cursor-text"
      >
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l.type === "input" ? (
              // Echoed command: coloured prompt prefix + white command text.
              // Use l.path (path captured at execution time) so history lines
              // always reflect the directory the command was run from.
              <>
                {PromptPrefix(l.path ?? currentPath)}
                {OutputText(l.text)}
              </>
            ) : l.type === "error" ? (
              ErrorText(l.text)
            ) : l.type === "boot" ? (
              BootText(l.text)
            ) : l.type === "dir" ? (
              DirText(l.text)
            ) : (
              OutputText(l.text)
            )}
          </div>
        ))}

        {/* Live input line — rendered inline with the output stream, not in a
            separate bar, so it behaves like a real Linux terminal prompt */}
        <div className="flex items-center whitespace-pre">
          <div className="shrink-0">{PromptPrefix(currentPath)}</div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-0 bg-transparent text-(--term-white) outline-none caret-(--term-prompt)"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

// ─── Terminal ─────────────────────────────────────────────────────────────────
// Owns the four-state machine (closed / panel / fullscreen / minimised),
// all terminal session logic, and side-effect wiring (router, resize, focus).

export function Terminal({ isDesktop, openTrigger, openMode }: TerminalProps) {
  const router = useRouter();

  // ── Window state ────────────────────────────────────────────────────────────
  const [state, setState] = useState<TerminalState>("closed");
  const [isMinimising, setIsMinimising] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirrors state in a ref so the resize debounce timeout can read the
  // current value at fire-time without adding `state` to the effect's
  // dependency array (which would reset the 500ms timer on every transition).
  const stateRef = useRef<TerminalState>("closed");
  stateRef.current = state;

  // Tracks the previous state so we can detect panel ↔ fullscreen toggles
  // and skip the genie animation (which would look like a close + reopen).
  const prevStateRef = useRef<TerminalState>("closed");
  useEffect(() => {
    prevStateRef.current = state;
  }, [state]);

  // ── Session state ────────────────────────────────────────────────────────────
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

  // ── Command dispatch ─────────────────────────────────────────────────────────

  const executeCommand = useCallback(
    (raw: string): CommandResult => {
      const trimmed = raw.trim();
      if (!trimmed) return { action: "none" };

      const fs = fsRef.current;
      const pathAtExecution = fs.pwd();
      const [cmd, ...args] = trimmed.split(/\s+/);

      switch (cmd.toLowerCase()) {
        // ── help ────────────────────────────────────────────────────────
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

        // ── ls ──────────────────────────────────────────────────────────
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

        // ── pwd ─────────────────────────────────────────────────────────
        case "pwd":
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine(pathAtExecution),
          ]);
          return { action: "none" };

        // ── cat ─────────────────────────────────────────────────────────
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

        // ── cd ──────────────────────────────────────────────────────────
        case "cd": {
          const target = args[0];

          // cd with no args or cd ~ → root
          if (!target || target === "~") {
            fs.cd("~");
            syncCwd();
            setLines((prev) => [...prev, inputLine(trimmed, pathAtExecution)]);
            return { action: "none" };
          }

          // cd() resolves internally — use the return value to avoid resolving twice
          const result = fs.cd(target);

          if (!result) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`cd: ${target}: no such directory`),
            ]);
            return { action: "none" };
          }

          syncCwd();
          setLines((prev) => [...prev, inputLine(trimmed, pathAtExecution)]);
          return { action: "none" };
        }

        // ── open ────────────────────────────────────────────────────────
        case "open": {
          const target = args[0];
          if (!target) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine("open: missing operand"),
            ]);
            return { action: "none" };
          }

          const node = fs.resolve(target);

          if (!node) {
            setLines((prev) => [
              ...prev,
              inputLine(trimmed, pathAtExecution),
              errorLine(`open: ${target}: no such file or directory`),
            ]);
            return { action: "none" };
          }

          if (!node.href) {
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
            outputLine(`→ opening ${node.href} ...`),
          ]);
          return { action: "navigate", navigateTo: node.href };
        }

        // ── clear ───────────────────────────────────────────────────────
        case "clear":
          setLines([]);
          return { action: "none" };

        // ── exit ────────────────────────────────────────────────────────
        case "exit":
          setLines((prev) => [
            ...prev,
            inputLine(trimmed, pathAtExecution),
            outputLine("Goodbye."),
          ]);
          return { action: "exit" };

        // ── unknown ─────────────────────────────────────────────────────
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

  // ── External open trigger — nav/hero increments this to open the terminal ──
  // Skips on mount (openTrigger === 0). openMode determines panel vs fullscreen.
  const prevTriggerRef = useRef(0);
  useEffect(() => {
    if (openTrigger === 0 || openTrigger === prevTriggerRef.current) return;
    prevTriggerRef.current = openTrigger;
    setState(openMode);
    initSession();
  }, [openTrigger, openMode, initSession]);

  // ── Resize — auto-minimise after 500ms below 1024px ────────────────────────
  useEffect(() => {
    if (isDesktop) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const current = stateRef.current;
      if (current === "panel" || current === "fullscreen") {
        setIsMinimising(true);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isDesktop]);

  // ── Auto-scroll to bottom whenever new lines are appended ──────────────────
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // ── Focus the input whenever the terminal becomes visible ──────────────────
  // Waits for the 200ms open animation to finish before focusing so the
  // browser doesn't interrupt the transform mid-play.
  useEffect(() => {
    if (state !== "panel" && state !== "fullscreen") return;
    const timer = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(timer);
  }, [state]);

  // ── State transition handlers ───────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setState("closed");
    resetSession();
  }, [resetSession]);

  // Starts the shrink animation — state stays 'panel'/'fullscreen' during the
  // animation so the element remains mounted. handleMinimiseEnd finalises the
  // transition once the CSS animation fires animationend.
  const handleMinimise = useCallback(() => {
    if (state !== "panel" && state !== "fullscreen") return;
    setIsMinimising(true);
  }, [state]);

  const handleMinimiseEnd = useCallback(() => {
    setIsMinimising(false);
    setState("minimised");
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (state === "panel") {
      setState("fullscreen");
    } else if (state === "fullscreen") {
      setState("panel");
    }
  }, [state]);

  // ── Input handlers ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    const result = executeCommand(inputValue);
    setInputValue("");
    if (result.action === "exit") {
      // Delay so "Goodbye." is readable before the panel closes
      setTimeout(handleClose, 400);
    } else if (result.action === "navigate") {
      router.push(result.navigateTo);
      handleClose();
    }
  }, [inputValue, executeCommand, handleClose, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  const isOpen = state === "panel" || state === "fullscreen";

  // Detect panel ↔ fullscreen toggle: both previous and current are open
  // states but different — skip the genie animation so it doesn't look
  // like a close + reopen.
  const wasOpen =
    prevStateRef.current === "panel" || prevStateRef.current === "fullscreen";
  // isOpenToOpen skips the animation class entirely when toggling between
  // panel and fullscreen — no open/close genie effect for that transition.
  const isOpenToOpen = wasOpen && isOpen && !isMinimising;

  const animationClass = isMinimising
    ? "animate-terminal-minimise"
    : isOpenToOpen
      ? ""
      : "animate-terminal-open";

  const windowProps = {
    lines,
    inputValue,
    isFullscreen: state === "fullscreen",
    currentPath: cwdPath,
    outputRef,
    inputRef,
    onInputChange: setInputValue,
    onKeyDown: handleKeyDown,
    onClose: handleClose,
    onMinimise: handleMinimise,
    onToggleFullscreen: handleToggleFullscreen,
  };

  return (
    <>
      {/* Panel — floating 300×380 window, anchored bottom-right */}
      {state === "panel" && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 w-[300px] h-[380px] bg-[var(--bg-term)] [border:0.5px_solid_rgba(175,169,236,0.15)] rounded-[8px] flex flex-col overflow-hidden shadow-2xl",
            animationClass,
          )}
          onAnimationEnd={isMinimising ? handleMinimiseEnd : undefined}
        >
          <TerminalWindow {...windowProps} />
        </div>
      )}

      {/* Fullscreen — full viewport overlay with centred content column */}
      {state === "fullscreen" && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-[var(--bg-term)] flex flex-col",
            animationClass,
          )}
          onAnimationEnd={isMinimising ? handleMinimiseEnd : undefined}
        >
          <div className="max-w-[900px] w-full mx-auto flex flex-col h-full py-4 px-6">
            <TerminalWindow {...windowProps} />
          </div>
        </div>
      )}
    </>
  );
}
