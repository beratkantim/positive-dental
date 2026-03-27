import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

// Sadece Home eager yüklenir (ilk sayfa), diğerleri lazy
import { Home } from "./pages/Home";

// Retry wrapper: deploy sonrası eski chunk hash'leri cache'te kalırsa otomatik reload
function lazyRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch(() => {
      // Chunk bulunamadıysa sayfayı bir kez yenile
      const key = "chunk-retry";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
      sessionStorage.removeItem(key);
      return factory();
    })
  );
}

const Services    = lazyRetry(() => import("./pages/Services").then(m => ({ default: m.Services })));
const About       = lazyRetry(() => import("./pages/About").then(m => ({ default: m.About })));
const Locations   = lazyRetry(() => import("./pages/Locations").then(m => ({ default: m.Locations })));
const Contact     = lazyRetry(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Kids        = lazyRetry(() => import("./pages/Kids").then(m => ({ default: m.Kids })));
const Blog        = lazyRetry(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogPost    = lazyRetry(() => import("./pages/BlogPost").then(m => ({ default: m.BlogPost })));
const Partners    = lazyRetry(() => import("./pages/Partners").then(m => ({ default: m.Partners })));
const Insurance   = lazyRetry(() => import("./pages/Insurance").then(m => ({ default: m.Insurance })));
const PriceList   = lazyRetry(() => import("./pages/PriceList").then(m => ({ default: m.PriceList })));
const Doctors     = lazyRetry(() => import("./pages/Doctors").then(m => ({ default: m.Doctors })));
const Appointment = lazyRetry(() => import("./pages/Appointment").then(m => ({ default: m.Appointment })));
const AdminPanel  = lazyRetry(() => import("./pages/Admin").then(m => ({ default: m.AdminPanel })));

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
      { path: "hizmetlerimiz",    element: <SuspenseWrap><Services /></SuspenseWrap> },
      { path: "hakkimizda",       element: <SuspenseWrap><About /></SuspenseWrap> },
      { path: "kliniklerimiz",   element: <SuspenseWrap><Locations /></SuspenseWrap> },
      { path: "iletisim",     element: <SuspenseWrap><Contact /></SuspenseWrap> },
      { path: "cocuk-dis-hekimligi",        element: <SuspenseWrap><Kids /></SuspenseWrap> },
      { path: "blog",        element: <SuspenseWrap><Blog /></SuspenseWrap> },
      { path: "blog/:slug",  element: <SuspenseWrap><BlogPost /></SuspenseWrap> },
      { path: "anlasmali-kurumlar",    element: <SuspenseWrap><Partners /></SuspenseWrap> },
      { path: "anlasmali-sigortalar",   element: <SuspenseWrap><Insurance /></SuspenseWrap> },
      { path: "fiyat-listesi",      element: <SuspenseWrap><PriceList /></SuspenseWrap> },
      { path: "doktorlarimiz",     element: <SuspenseWrap><Doctors /></SuspenseWrap> },
      { path: "randevu",     element: <SuspenseWrap><Appointment /></SuspenseWrap> },
    ],
  },
]);
