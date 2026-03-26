import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

// Sadece Home eager yüklenir (ilk sayfa), diğerleri lazy
import { Home } from "./pages/Home";

const Services    = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const About       = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Locations   = lazy(() => import("./pages/Locations").then(m => ({ default: m.Locations })));
const Contact     = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Kids        = lazy(() => import("./pages/Kids").then(m => ({ default: m.Kids })));
const Blog        = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogPost    = lazy(() => import("./pages/BlogPost").then(m => ({ default: m.BlogPost })));
const Partners    = lazy(() => import("./pages/Partners").then(m => ({ default: m.Partners })));
const Insurance   = lazy(() => import("./pages/Insurance").then(m => ({ default: m.Insurance })));
const PriceList   = lazy(() => import("./pages/PriceList").then(m => ({ default: m.PriceList })));
const Doctors     = lazy(() => import("./pages/Doctors").then(m => ({ default: m.Doctors })));
const Appointment = lazy(() => import("./pages/Appointment").then(m => ({ default: m.Appointment })));
const AdminPanel  = lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminPanel })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <SuspenseWrap><AdminPanel /></SuspenseWrap>,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "services",    element: <SuspenseWrap><Services /></SuspenseWrap> },
      { path: "about",       element: <SuspenseWrap><About /></SuspenseWrap> },
      { path: "locations",   element: <SuspenseWrap><Locations /></SuspenseWrap> },
      { path: "contact",     element: <SuspenseWrap><Contact /></SuspenseWrap> },
      { path: "kids",        element: <SuspenseWrap><Kids /></SuspenseWrap> },
      { path: "blog",        element: <SuspenseWrap><Blog /></SuspenseWrap> },
      { path: "blog/:slug",  element: <SuspenseWrap><BlogPost /></SuspenseWrap> },
      { path: "partners",    element: <SuspenseWrap><Partners /></SuspenseWrap> },
      { path: "insurance",   element: <SuspenseWrap><Insurance /></SuspenseWrap> },
      { path: "prices",      element: <SuspenseWrap><PriceList /></SuspenseWrap> },
      { path: "doctors",     element: <SuspenseWrap><Doctors /></SuspenseWrap> },
      { path: "randevu",     element: <SuspenseWrap><Appointment /></SuspenseWrap> },
    ],
  },
]);
