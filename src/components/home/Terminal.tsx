"use client";

import {
  forwardRef,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { VscTerminal } from "react-icons/vsc";
import { cn } from "@/utils/cn";
import { useTerminal, type OutputLine } from "@/hooks/useTerminal";
import { TERMINAL_USER, TERMINAL_HOST } from "@/constants/terminal";

// ─── Types ────────────────────────────────────────────────────────────────────

type TerminalState = "closed" | "panel" | "fullscreen" | "minimised";

export interface TerminalHandle {
  open: (mode: "panel" | "fullscreen") => void;
}

export interface TerminalProps {
  isDesktop: boolean;
  heroRef: RefObject<HTMLElement | null>;
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
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Close terminal"
          />
          <button
            onClick={onMinimise}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Minimise terminal"
          />
          <button
            onClick={onToggleFullscreen}
            className="w-3 h-3 rounded-full bg-[#28c840] hover:opacity-75 transition-opacity cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          />
        </div>

        <span className="font-mono text-[11px] text-[--text-dim]">
          {currentPath}
        </span>

        {/* Mirrors the dots cluster width so the path appears visually centred */}
        <div className="w-[54px]" />
      </div>

      {/* Scrollable output — overflow-x-auto prevents long lines being clipped */}
      <div
        ref={outputRef}
        className="flex-1 overflow-auto px-3 py-2 font-mono text-[12px] leading-[1.75]"
      >
        {lines.map((l) => (
          <div key={l.id} className="whitespace-pre">
            {l.type === "input" ? (
              // Echoed command: coloured prompt prefix + white command text.
              // Use l.path (path captured at execution time) so history lines
              // always reflect the directory the command was run from.
              <>
                <span className="text-[--term-prompt]">{TERMINAL_USER}@{TERMINAL_HOST}</span>
                <span className="text-[--term-white]">:</span>
                <span className="text-[--term-path]">{l.path ?? currentPath}</span>
                <span className="text-[--term-white]">$ </span>
                <span className="text-[--term-white]">{l.text}</span>
              </>
            ) : (
              <span className={cn(
                l.type === "output" && "text-[--term-white]",
                l.type === "error"  && "text-[--term-error]",
                l.type === "boot"   && "text-[--text-muted]",
                l.type === "dir"    && "text-[--term-path] font-bold",
              )}>
                {l.text}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Prompt input row
          Fullscreen: full coloured user@host:path$ prompt
          Panel: short $ prompt — the full prompt is visible in the output history */}
      <div className="flex items-center px-3 py-2 [border-top:0.5px_solid_rgba(175,169,236,0.08)] shrink-0 font-mono text-[12px]">
        {isFullscreen ? (
          <>
            <span className="text-[--term-prompt] shrink-0">{TERMINAL_USER}@{TERMINAL_HOST}</span>
            <span className="text-[--term-white] shrink-0">:</span>
            <span className="text-[--term-path] shrink-0">{currentPath}</span>
            <span className="text-[--term-white] shrink-0 mr-2">$</span>
          </>
        ) : (
          <span className="text-[--term-prompt] shrink-0 mr-2">$</span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-[--term-white] outline-none placeholder:text-[--text-dim] caret-[--term-prompt]"
          placeholder="type a command..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </>
  );
}

// ─── Terminal ─────────────────────────────────────────────────────────────────
// Owns the four-state machine (closed / panel / fullscreen / minimised),
// the FAB button, and all side-effect wiring (router, resize, focus).

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(
  function Terminal({ isDesktop, heroRef }, ref) {
    const router = useRouter();

    const [state, setState] = useState<TerminalState>("closed");
    const [prevOpenState, setPrevOpenState] = useState<"panel" | "fullscreen">(
      "panel",
    );
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const [isAmberPulsing, setIsAmberPulsing] = useState(false);
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
    // The ref holds the PREVIOUS value during render because the useEffect
    // that updates it runs AFTER paint.
    const prevStateRef = useRef<TerminalState>("closed");
    useEffect(() => {
      prevStateRef.current = state;
    }, [state]);

    const { lines, currentPath, initSession, resetSession, executeCommand } = useTerminal();

    // ── Imperative handle — lets page.tsx call terminal.open() ───────────────
    useImperativeHandle(
      ref,
      () => ({
        open(mode: "panel" | "fullscreen") {
          setState(mode);
          setPrevOpenState(mode);
          initSession();
        },
      }),
      [initSession],
    );

    // ── Hero visibility — controls when the FAB appears ──────────────────────
    useEffect(() => {
      const el = heroRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => setIsHeroVisible(entry.isIntersecting),
        { threshold: 0.1 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [heroRef]);

    // ── Resize — auto-minimise after 500ms below 1024px ──────────────────────
    useEffect(() => {
      if (isDesktop) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        return;
      }
      debounceRef.current = setTimeout(() => {
        const current = stateRef.current;
        if (current === "panel" || current === "fullscreen") {
          setPrevOpenState(current);
          setIsMinimising(true);
        }
      }, 500);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, [isDesktop]);

    // ── Auto-scroll to bottom whenever new lines are appended ────────────────
    useEffect(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, [lines]);

    // ── Focus the input whenever the terminal becomes visible ─────────────────
    useEffect(() => {
      if (state === "panel" || state === "fullscreen") {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, [state]);

    // ── State transition handlers ────────────────────────────────────────────

    const handleFabClick = useCallback(() => {
      if (state === "minimised") {
        setState(prevOpenState);
      } else {
        // FAB always opens panel mode; fullscreen is hero-button only
        setState("panel");
        setPrevOpenState("panel");
        initSession();
      }
    }, [state, prevOpenState, initSession]);

    const handleClose = useCallback(() => {
      setState("closed");
      resetSession();
    }, [resetSession]);

    // Starts the shrink-towards-FAB animation — state stays 'panel'/'fullscreen'
    // during the animation so the element remains mounted. handleMinimiseEnd
    // finalises the transition once the CSS animation fires animationend.
    const handleMinimise = useCallback(() => {
      if (state !== "panel" && state !== "fullscreen") return;
      setPrevOpenState(state);
      setIsMinimising(true);
    }, [state]);

    const handleMinimiseEnd = useCallback(() => {
      setIsMinimising(false);
      setState("minimised");
      setIsAmberPulsing(true);
      setTimeout(() => setIsAmberPulsing(false), 1200);
    }, []);

    const handleToggleFullscreen = useCallback(() => {
      if (state === "panel") {
        setState("fullscreen");
        setPrevOpenState("fullscreen");
      } else if (state === "fullscreen") {
        setState("panel");
        setPrevOpenState("panel");
      }
    }, [state]);

    // ── Command dispatch ─────────────────────────────────────────────────────

    const handleSubmit = useCallback(() => {
      const result = executeCommand(inputValue);
      setInputValue("");
      if (result.action === "exit") {
        // Delay so "Goodbye." is readable before the panel closes
        setTimeout(handleClose, 400);
      } else if (result.action === "navigate") {
        setTimeout(() => router.push(result.navigateTo), 500);
      }
    }, [inputValue, executeCommand, handleClose, router]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSubmit();
      },
      [handleSubmit],
    );

    // ── Render ───────────────────────────────────────────────────────────────

    const isOpen = state === "panel" || state === "fullscreen";
    const showFab = !isHeroVisible && !isOpen;

    // Detect panel ↔ fullscreen toggle: both previous and current are open
    // states but different — skip the genie animation so it doesn't look
    // like a close + reopen from the FAB.
    const wasOpen =
      prevStateRef.current === "panel" || prevStateRef.current === "fullscreen";
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
      currentPath,
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
        {/* FAB — visible after hero scrolls out of view, hidden when open */}
        {showFab && (
          <button
            onClick={handleFabClick}
            className={cn(
              "fixed bottom-20 right-6 z-50 w-10 h-10 rounded-[8px] bg-[var(--bg-card)] flex items-center justify-center transition-colors duration-[180ms] cursor-pointer",
              isAmberPulsing
                ? "[border:0.5px_solid_rgba(186,117,23,0.5)] text-[--amber]"
                : "[border:0.5px_solid_rgba(175,169,236,0.15)] text-[--text-muted] hover:text-[--accent] hover:[border-color:rgba(175,169,236,0.28)]",
            )}
            aria-label="Open terminal"
          >
            <VscTerminal size={16} />
          </button>
        )}

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
  },
);
