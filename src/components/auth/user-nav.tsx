
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogIn, LogOut, UserCircle, History, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


export function UserNav() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const [isHoveringSignUp, setIsHoveringSignUp] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/'); // Redirect to home after sign out
    } catch (error) {
      console.error("Sign out error", error);
      // Handle error (e.g., show a toast)
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          asChild
          className="relative overflow-hidden group hover:bg-transparent dark:hover:bg-transparent"
        >
          <Link href="/login" className="flex items-center justify-center w-full h-full">
            {/* Water fill effect element */}
            <span
              className="absolute bottom-0 left-[-100%] w-full h-full
                         bg-white
                         transition-all duration-[1500ms] ease-out
                         group-hover:left-0"
              aria-hidden="true"
              style={{ zIndex: 0 }} 
            />
            {/* Icon and Text wrapper */}
            <span className="relative z-10 flex items-center">
              <LogIn
                className="mr-2 h-4 w-4
                           text-foreground group-hover:text-black
                           dark:text-foreground dark:group-hover:text-black
                           transition-colors duration-300"
              />
              <span
                className="text-foreground group-hover:text-black
                           dark:text-foreground dark:group-hover:text-black
                           transition-colors duration-300"
              >
                Login
              </span>
            </span>
          </Link>
        </Button>
        <Button
          asChild
          className="relative overflow-hidden group
                     bg-background text-foreground
                     dark:bg-foreground dark:text-background
                     border border-foreground dark:border-background
                     transition-colors duration-300 ease-in-out
                     hover:text-foreground dark:hover:text-background"
          onMouseEnter={() => setIsHoveringSignUp(true)}
          onMouseLeave={() => setIsHoveringSignUp(false)}
        >
          <Link href="/signup" className="flex items-center justify-center w-full h-full">
            {/* Water fill effect element */}
            <span
              className="absolute bottom-0 left-0 w-full 
                         bg-black
                         transition-all duration-[700ms] ease-out
                         group-hover:h-full h-0"
              aria-hidden="true"
            />
            {/* Icon and Text */}
            <motion.span 
              className="relative z-10 flex items-center"
              animate={{ fontWeight: isHoveringSignUp ? 900 : 400 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <PlusCircle
                className="mr-2 h-4 w-4 
                           text-foreground group-hover:text-white
                           dark:text-background dark:group-hover:text-white
                           transition-colors duration-300"
              />
              <span
                className="text-foreground group-hover:text-white
                           dark:text-background dark:group-hover:text-white
                           transition-colors duration-300"
              >
                Sign Up
              </span>
            </motion.span>
          </Link>
        </Button>
      </div>
    );
  }

  const userInitials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email ? user.email[0].toUpperCase() : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email || user.uid}.png`} alt={user.displayName || "User"} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile"> {/* Assuming a /profile page */}
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/history">
              <History className="mr-2 h-4 w-4" />
              <span>Paper History</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled> {/* Placeholder for settings */}
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
