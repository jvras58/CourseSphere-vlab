"use client";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { UserNav } from "./user-nav";
import { useSession } from "@/modules/auth/utils/sync-session";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

interface NavbarProps {
  title: string;
  isMobile?: boolean;
  open?: boolean;
  openMobile?: boolean;
  setOpen?: (open: boolean) => void;
  setOpenMobile?: (open: boolean) => void;
  toggleSidebar?: () => void;
}

export function Navbar({
  title,
  isMobile = false,
  open = false,
  openMobile = false,
  setOpen,
  setOpenMobile,
  toggleSidebar,
}: NavbarProps) {
  const path = usePathname();
  const { session } = useSession();

  const handleToggle = () => {
    if (isMobile && setOpenMobile) {
      setOpenMobile(!openMobile);
    } else if (setOpen) {
      setOpen(!open);
    }
    toggleSidebar?.();
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div
        className={`mx-4 sm:mx-8 flex h-14 items-center ${
          isMobile || !open ? "ml-16" : "ml-64"
        }`}
      >
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="-ml-1" onClick={handleToggle} />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-bold hidden md:block text-nowrap">{title}</h1>
        </div>

        <div
          className={`flex items-center space-x-2 justify-end ${
            path !== "/" ? "w-full" : ""
          }`}
        >
          <ModeToggle />
          {session && <UserNav />}
        </div>
      </div>
    </header>
  );
}