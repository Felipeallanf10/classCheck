"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Toggle>
  );
}
