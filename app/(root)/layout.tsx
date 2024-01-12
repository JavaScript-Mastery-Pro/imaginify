import { MobileNav } from "@/components/shared/MobileNav";
import { Sidebar } from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row ">
      {/* Hidden on smalle screens */}
      <Sidebar />
      {/* Hidden on medium screens */}
      <MobileNav />

      <main className="flex-1 overflow-auto py-8 md:max-h-screen lg:py-10">
        <div className="wrapper">{children}</div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
