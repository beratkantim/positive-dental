import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActionBar } from "./FloatingActionBar";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pb-20 md:pb-24">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionBar />
    </div>
  );
}