'use client';

import React from "react";
import { UserNav } from "@/components/user-nav";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Home, Calendar, Cake, Megaphone, User, Settings, Bot, LifeBuoy, Shapes, Users, Landmark, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User as UserType } from "@/lib/data";

export function DashboardClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserType;
}) {
  const pathname = usePathname();
  const [financeMenuOpen, setFinanceMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (pathname.startsWith('/dashboard/keuangan')) {
        setFinanceMenuOpen(true);
    }
  }, [pathname]);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/events", label: "Events", icon: Calendar },
    { href: "/dashboard/birthdays", label: "Birthdays", icon: Cake },
    { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
    { href: "/dashboard/members", label: "Members", icon: Users },
    { 
      id: "keuangan",
      label: "Keuangan", 
      icon: Landmark, 
      subMenus: [
        { href: "/dashboard/keuangan/uang-pangkal", label: "Uang Pangkal" },
        { href: "/dashboard/keuangan/iuran-bulanan", label: "Iuran Bulanan" },
      ]
    },
    { href: "/dashboard/announcements/new", label: "AI Generator", icon: Bot },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shapes className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Organizee</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) =>
              item.subMenus ? (
                <SidebarMenuItem key={item.id} asChild>
                  <Collapsible open={financeMenuOpen} onOpenChange={setFinanceMenuOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            financeMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <SidebarMenuSub>
                        {item.subMenus.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <Link href={subItem.href}>
                              <SidebarMenuSubButton isActive={pathname === subItem.href}>
                                {subItem.label}
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href!} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help">
                  <LifeBuoy className="h-5 w-5" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
