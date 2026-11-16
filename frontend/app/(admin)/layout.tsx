import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/features/auth/lib/cookies";
import { logoutAction } from "@/features/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/shadcn/collapsible";
import { Separator } from "@/shared/ui/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/ui/shadcn/sidebar";
import { Avatar, AvatarFallback } from "@/shared/ui/shadcn/avatar";

import { ChevronRight, LogOut, SquareTerminal } from "lucide-react";

const items = [
  {
    title: "Каталог",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Товары",
        url: "/admin/catalog",
      },
      {
        title: "Категории",
        url: "/admin/catalog/categories",
      },
      {
        title: "Бренды",
        url: "/admin/catalog/brands",
      },
    ],
  },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <Link
            href="/"
            aria-label="На главную"
            className="flex min-w-0 flex-col items-center gap-2"
          >
            <Image
              src="/images/logo.png"
              alt="ПРОСТОР"
              width={1626}
              height={967}
              className="h-8 w-auto max-w-full object-contain group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:max-w-6"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Управление</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={<SidebarMenuButton tooltip={item.title} />}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton render={<a href={subItem.url} />}>
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-1 py-2 group-data-[collapsible=icon]:hidden">
              <Avatar>
                <AvatarFallback>
                  {session?.login.charAt(0).toLocaleUpperCase("ru-RU") ?? "?"}
                </AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-medium">
                {session?.login ?? "Пользователь"}
              </p>
            </div>
            <form action={logoutAction} className="shrink-0">
              <SidebarMenuButton
                type="submit"
                tooltip="Выйти"
                className="w-auto text-muted-foreground hover:text-destructive"
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Выйти
                </span>
              </SidebarMenuButton>
            </form>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2" />
          </div>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
