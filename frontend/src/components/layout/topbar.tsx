"use client";

import { Bell, Search, Menu, User, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      // Force reload to clear client state and redirect due to 401s
      window.location.href = "/login";
    },
  });

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 shadow-sm z-10 sticky top-0">
      <Sheet>
        <SheetTrigger render={
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        } />
        <SheetContent side="left" className="flex flex-col w-[300px] p-0">
          <div className="flex h-14 items-center border-b px-6 bg-muted/20">
            <span className="text-lg font-bold tracking-tight text-primary">InfraPM Enterprise</span>
          </div>
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-2">Navigation</div>
            <a href="/" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">Dashboard</a>
            <a href="/projects" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">Projects</a>
            <a href="/users" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">Users</a>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1 flex items-center">
        <form className="hidden md:flex w-full max-w-md relative group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search across all projects, users, and tasks (Press / to focus)"
            className="w-full appearance-none bg-muted/50 pl-8 shadow-none border-transparent focus-visible:bg-background focus-visible:border-primary transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          <span className="sr-only">Toggle notifications</span>
        </Button>

        <div className="h-6 w-px bg-border mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger render={
             <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 border hover:bg-muted">
              <User className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Superuser Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  super@admin.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
