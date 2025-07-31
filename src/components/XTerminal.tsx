"use client";

import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import 'xterm/css/xterm.css';

export default function XTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const webglAddon = useRef<WebglAddon | null>(null);
  const inputRef = useRef('');
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const isInitialized = useRef(false);

  const writePrompt = useCallback((term: Terminal) => {
    term.write('\x1b[32muser@browser\x1b[0m:\x1b[34m~\x1b[0m$ ');
  }, []);

  const processCommand = useCallback((term: Terminal, command: string) => {
    if (!command.trim()) {
      writePrompt(term);
      return;
    }

    term.write('\r\n');

    const [cmd, ...args] = command.trim().split(/\s+/);
    switch (cmd.toLowerCase()) {
      case 'help':
        term.writeln('Available commands:');
        term.writeln('help    - Show this help message');
        term.writeln('clear   - Clear the terminal');
        term.writeln('echo    - Print arguments');
        term.writeln('ls      - List directory contents');
        break;
      case 'clear':
        term.clear();
        break;
      case 'echo':
        term.writeln(args.join(' '));
        break;
      case 'ls':
        term.writeln('bin   dev  home  lib  proc  tmp  var');
        term.writeln('boot  etc  init  mnt  root  usr');
        break;
      default:
        term.writeln(`${cmd}: command not found`);
    }

    writePrompt(term);
  }, [writePrompt]);

  const onDataHandler = useCallback((data: string) => {
    const term = terminal.current;
    if (!term) return;

    const printable = !(data.charCodeAt(0) < 32 || data.charCodeAt(0) === 127);

    if (data === '\r') {
      const command = inputRef.current;
      term.write('\r\n');
      processCommand(term, command);
      inputRef.current = '';
    } else if (data === '\x7f') {
      if (inputRef.current.length > 0) {
        inputRef.current = inputRef.current.slice(0, -1);
        term.write('\b \b');
      }
    } else if (printable) {
      inputRef.current += data;
      term.write(data);
    }
  }, [processCommand]);

  useEffect(() => {
    if (!terminalRef.current || isInitialized.current) return;

    const newTerminal = new Terminal({
      fontFamily: '"Cascadia Code", "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      allowProposedApi: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#f0f0f0',
        cursor: '#4af626',
        selectionBackground: 'rgba(74, 246, 38, 0.3)',
      },
    });

    const newFitAddon = new FitAddon();
    newTerminal.loadAddon(newFitAddon);
    fitAddon.current = newFitAddon;

    try {
      const newWebglAddon = new WebglAddon();
      newWebglAddon.onContextLoss(() => {
        try {
          newWebglAddon.dispose();
        } catch (e) {
          console.warn('WebGL context loss cleanup error:', e);
        }
        webglAddon.current = null;
      });
      newTerminal.loadAddon(newWebglAddon);
      webglAddon.current = newWebglAddon;
    } catch {
      console.warn('Using canvas fallback');
    }

    newTerminal.open(terminalRef.current);

    // ✅ Safe fit using requestAnimationFrame
    requestAnimationFrame(() => {
      try {
        newFitAddon.fit();
      } catch (e) {
        console.warn('Initial fit error:', e);
      }
    });

    newTerminal.writeln('Linux Terminal Emulator v1.0');
    newTerminal.writeln('Type "help" for commands\r\n');
    writePrompt(newTerminal);

    newTerminal.onData(onDataHandler);
    terminal.current = newTerminal;
    isInitialized.current = true;

    // ✅ ResizeObserver with safety checks
    resizeObserver.current = new ResizeObserver(() => {
      if (!terminalRef.current || !fitAddon.current) return;
      requestAnimationFrame(() => {
        try {
          fitAddon.current?.fit();
        } catch (e) {
          console.warn('ResizeObserver fit error:', e);
        }
      });
    });

    resizeObserver.current.observe(terminalRef.current);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
        resizeObserver.current = null;
      }

      if (terminal.current) {
        try {
          terminal.current.dispose();
        } catch (e) {
          console.warn('Terminal dispose error:', e);
        } finally {
          terminal.current = null;
        }
      }

      if (webglAddon.current) {
        try {
          webglAddon.current.dispose();
        } catch (e) {
          console.warn('WebGL dispose error:', e);
        } finally {
          webglAddon.current = null;
        }
      }

      if (fitAddon.current) {
        try {
          fitAddon.current.dispose();
        } catch (e) {
          console.warn('FitAddon dispose error:', e);
        } finally {
          fitAddon.current = null;
        }
      }

      isInitialized.current = false;
    };
  }, [processCommand, writePrompt, onDataHandler]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        overflow: 'hidden',
      }}
    />
  );
}
