import { Navbar } from "./Navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
  open?: boolean;
  openMobile?: boolean;
  setOpen?: (open: boolean) => void;
  setOpenMobile?: (open: boolean) => void;
  toggleSidebar?: () => void;
}

export function ContentLayout({
  title,
  children,
  className = "container pt-8 pb-8 px-4 sm:px-8",
  isMobile = false,
  open = false,
  openMobile = false,
  setOpen,
  setOpenMobile,
  toggleSidebar,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar
        title={title}
        isMobile={isMobile}
        open={open}
        openMobile={openMobile}
        setOpen={setOpen}
        setOpenMobile={setOpenMobile}
        toggleSidebar={toggleSidebar}
      />
      <div className={`${className} ${isMobile || !open ? "ml-16" : "ml-64"}`}>
        {children}
      </div>
    </div>
  );
}