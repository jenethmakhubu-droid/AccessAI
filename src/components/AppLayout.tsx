import { Link, useRouterState } from "@tanstack/react-router";
import {
  Accessibility,
  Calendar,
  FileText,
  Home,
  Info,
  Mail,
  MessagesSquare,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { AccessibilityDrawer } from "./AccessibilityDrawer";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Email Assistant", to: "/email", icon: Mail },
  { label: "Meeting Assistant", to: "/meeting", icon: NotebookPen },
  { label: "Task Planner", to: "/planner", icon: Calendar },
  { label: "Research", to: "/research", icon: Search },
  { label: "Document Simplifier", to: "/simplify", icon: FileText },
  { label: "Chat with Ava", to: "/chat", icon: MessagesSquare },
] as const;

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-elevated">
        <Accessibility className="h-5 w-5 text-primary-foreground" strokeWidth={2.25} />
      </div>
      <div className="leading-tight">
        <div className="font-serif text-lg">AccessAI</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Inclusive assistant
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <SidebarProvider>
      <div className="min-h-dvh flex w-full bg-gradient-soft">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-3">
            <Link to="/" className="block px-1 py-1 rounded-lg hover:bg-sidebar-accent transition">
              <BrandMark />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>About</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/about"} tooltip="About AccessAI">
                      <Link to="/about">
                        <Info className="h-4 w-4" />
                        <span>About AccessAI</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-background/60 backdrop-blur px-3 sm:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger aria-label="Toggle navigation" />
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Making workplace AI accessible to everyone.
              </div>
            </div>
            <AccessibilityDrawer />
          </header>
          <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
            {children}
          </main>
          <footer className="border-t bg-background/60 py-6 px-6 text-center text-xs text-muted-foreground">
            <div className="font-serif text-base text-foreground">AccessAI</div>
            <div>Making workplace AI accessible to everyone.</div>
            <div className="mt-1">Designed to make workplace AI more inclusive, productive and accessible.</div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}