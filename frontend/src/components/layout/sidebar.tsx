"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Folders, Settings, Activity, Building2, Map, FileBarChart2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const topNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Building2 },
  { name: "Project Map", href: "/map", icon: Map },
  { name: "Reports", href: "/reports", icon: FileBarChart2 },
];

const adminNavigation = [
  { name: "User Directory", href: "/users", icon: Users },
  { name: "Hierarchy / Regions", href: "/hierarchy", icon: Folders },
  { name: "Audit Logs", href: "/audit", icon: Activity },
  { name: "System Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background lg:block lg:w-64 shrink-0 shadow-sm z-10">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-muted/20">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-lg">InfraPM <span className="font-light">Enterprise</span></span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <div className="px-3 mb-4">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Overview
            </h2>
            <nav className="grid gap-1">
              {topNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-3">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase mt-6">
              Administration
            </h2>
            <nav className="grid gap-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
        <div className="mt-auto p-4 border-t bg-muted/20">
            <div className="flex items-center gap-3 rounded-lg bg-background border p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold text-sm">SU</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">Superuser</span>
                    <span className="text-xs text-muted-foreground mt-1">super@admin.com</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
