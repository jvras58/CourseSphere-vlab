"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMenuList } from "@/lib/menu-list";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea>
      <nav className="mt-4 w-full">
        <ul className="flex flex-col gap-2 px-2">
          {menuList.map(({ groupLabel, menus }, idx) => (
            <li key={idx} className="w-full">
              {groupLabel && isOpen && (
                <p className="text-xs font-semibold text-muted-foreground px-2 pb-1 uppercase tracking-wide">
                  {groupLabel}
                </p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, i) =>
                submenus.length === 0 ? (
                  <Link
                    key={i}
                    href={href}
                    target={
                      href.startsWith("https://api.whatsapp.com/") ? "_blank" : ""
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon size={18} />
                    {isOpen && <span className="truncate">{label}</span>}
                  </Link>
                ) : (
                  // TODO: submenus:
                  <div key={i}>
                    {/* Submenu */}
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}