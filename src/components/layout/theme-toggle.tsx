
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="
            relative group overflow-hidden
            border-border
            bg-background hover:bg-transparent  /* Allow span to be visible */
            dark:bg-background dark:hover:bg-transparent /* Allow span to be visible in dark */
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            transition-colors duration-150 
          "
        >
          {/* Water fill effect element */}
          <span
            aria-hidden="true"
            className="
              absolute inset-0 w-full h-full rounded-full
              bg-foreground /* Black in light, White in dark */
              origin-center transform scale-0
              group-hover:scale-[1.5] /* Scale to cover button */
              transition-transform duration-300 ease-out
            "
            style={{ zIndex: 0 }} /* Behind icons */
          />

          {/* Icons: color inverts on hover */}
          <Sun className="
            relative z-10 h-[1.2rem] w-[1.2rem]
            rotate-0 scale-100 transition-all
            dark:-rotate-90 dark:scale-0
            text-foreground group-hover:text-background /* e.g. Light mode: Sun (dark) -> on hover text (light) */
          " />
          <Moon className="
            absolute z-10 h-[1.2rem] w-[1.2rem]
            rotate-90 scale-0 transition-all
            dark:rotate-0 dark:scale-100
            text-foreground group-hover:text-background /* e.g. Dark mode: Moon (light) -> on hover text (dark) */
          " />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

