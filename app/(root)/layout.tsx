import { Navbar } from "@/components/shared/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center min-h-screen flex-col bg-purple-100">
      <Navbar />
      <main className="wrapper flex-1 py-10 md:py-14">{children}</main>
    </div>
  );
};

export default Layout;
