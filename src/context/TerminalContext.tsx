"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Terminal, type TerminalMode } from "@/components/home/Terminal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ─── Context ──────────────────────────────────────────────────────────────────

interface TerminalContextValue {
  openTerminal: (mode: TerminalMode) => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useTerminalContext(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error("useTerminalContext must be used inside <TerminalProvider>");
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
// Owns all terminal state and exposes openTerminal() to any component in the
// tree. Also renders <Terminal> itself so it is mounted at layout level and
// persists across page navigations.

export function TerminalProvider({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Terminal mounts the first time isDesktop becomes true and stays mounted
  // thereafter. This preserves session state if the viewport briefly narrows
  // below 1024px — Terminal handles auto-minimise internally via its resize effect.
  const [terminalEnabled, setTerminalEnabled] = useState(false);
  useEffect(() => {
    if (isDesktop) setTerminalEnabled(true);
  }, [isDesktop]);

  // Incrementing the trigger fires the open effect inside Terminal.
  // A counter (rather than a boolean) means each call is a distinct event,
  // even if the terminal is already in a given state.
  const [terminalTrigger, setTerminalTrigger] = useState(0);
  const [terminalMode, setTerminalMode] = useState<TerminalMode>("panel");

  const openTerminal = useCallback((mode: TerminalMode) => {
    setTerminalMode(mode);
    setTerminalTrigger((t) => t + 1);
  }, []);

  return (
    <TerminalContext.Provider value={{ openTerminal }}>
      {children}
      {terminalEnabled && (
        <Terminal
          isDesktop={isDesktop}
          openTrigger={terminalTrigger}
          openMode={terminalMode}
        />
      )}
    </TerminalContext.Provider>
  );
}
