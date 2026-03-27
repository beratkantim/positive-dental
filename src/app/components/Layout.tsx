import { lazy, Suspense } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePageView } from "../hooks/usePageView";

const FloatingActionBar = lazy(() =>
  import("./FloatingActionBar").then(m => ({ default: m.FloatingActionBar }))
);

export function Layout() {
  usePageView();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pb-20 md:pb-24">
        <Outlet />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <FloatingActionBar />
      </Suspense>
    </div>
  );
}
