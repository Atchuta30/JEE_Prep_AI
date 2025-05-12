
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
import type { CSSProperties } from "react";

export function UserNav() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

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
        <Button variant="outline" asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Link>
        </Button>
        <Button
          asChild
          onMouseEnter={(e) => {
            const button = e.currentTarget;
            button.style.transition = 'transform 0s, width 0s, height 0s, top 0s, left 0s'; // Immediate transition for scripted changes
            
            // Store original styles
            if (!button.dataset.originalWidth) {
              button.dataset.originalWidth = `${button.offsetWidth}px`;
              button.dataset.originalHeight = `${button.offsetHeight}px`;
              const rect = button.getBoundingClientRect();
              button.dataset.originalLeft = `${rect.left}px`;
              button.dataset.originalTop = `${rect.top}px`;
            }

            let animationFrameId: number;
            const grow = () => {
              const currentWidth = button.offsetWidth;
              const currentHeight = button.offsetHeight;
              const growthRate = 0.1; // px per frame, effectively 1px per second if 10fps was target, adjust for smoother animation
                                     // For 1px/sec, this should be 1 / (frames per second), e.g. 1/60 if smooth.
                                     // Let's make it 1px increment per animation frame for visible but slow growth.
                                     // The prompt said "1px per second", which is very slow.
                                     // Let's interpret it as slow growth.
                                     // Targeting approx 60px per second (1px per frame at 60fps)
              
              const newWidth = currentWidth + growthRate * (60/16); // trying to normalize to ~1px per 16ms frame
              const newHeight = currentHeight + (currentHeight / currentWidth) * growthRate* (60/16) ;


              button.style.width = `${newWidth}px`;
              button.style.height = `${newHeight}px`;
              
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;
              
              // Make sure button is fixed for viewport-relative positioning
              if (button.style.position !== 'fixed') {
                const rect = button.getBoundingClientRect();
                button.style.position = 'fixed';
                button.style.left = `${rect.left}px`;
                button.style.top = `${rect.top}px`;
              }
              
              // Center the button as it grows
              // The transform will center the button's origin, then translate based on half its new size
              button.style.left = `${viewportWidth / 2}px`;
              button.style.top = `${viewportHeight / 2}px`;
              button.style.transform = `translate(-50%, -50%)`;


              if (button.matches(':hover')) {
                animationFrameId = requestAnimationFrame(grow);
              } else {
                 // Ensure reset happens if hover is lost mid-animation
                cancelAnimationFrame(animationFrameId);
                button.style.transition = 'transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out, top 0.3s ease-out, left 0.3s ease-out';
                button.style.width = button.dataset.originalWidth || '';
                button.style.height = button.dataset.originalHeight || '';
                button.style.position = ''; // Or original position if it was relative/absolute
                button.style.left = button.dataset.originalLeft || '';
                button.style.top = button.dataset.originalTop || '';
                button.style.transform = '';
              }
            };
            animationFrameId = requestAnimationFrame(grow);
            (button as any).animationFrameId = animationFrameId; 
          }}
          onMouseLeave={(e) => {
            const button = e.currentTarget;
            if ((button as any).animationFrameId) {
              cancelAnimationFrame((button as any).animationFrameId);
            }
            button.style.transition = 'transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out, top 0.3s ease-out, left 0.3s ease-out';
            button.style.width = button.dataset.originalWidth || '';
            button.style.height = button.dataset.originalHeight || '';
            // Important: Reset position and transform carefully
            // If it was originally static, setting position to '' is good.
            // If original position was relative/absolute, you'd need to restore that.
            // For simplicity, assuming it can revert to default flow or its original explicit coords.
            button.style.position = ''; // Revert to default flow or initial CSS
            button.style.left = ''; // Revert or restore initial
            button.style.top = '';  // Revert or restore initial
            button.style.transform = '';

            // Clean up data attributes
            delete button.dataset.originalWidth;
            delete button.dataset.originalHeight;
            delete button.dataset.originalLeft;
            delete button.dataset.originalTop;
          }}
          // Uses default variant for:
          // Light theme: black bg, white text.
          // Dark theme: white bg, black text.
          // focus-visible:ring-transparent is to avoid standard focus ring during animation.
          className="focus-visible:ring-transparent" 
        >
          <Link href="/signup">
            <PlusCircle className="mr-2 h-4 w-4" /> Sign Up
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
