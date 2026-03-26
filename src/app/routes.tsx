import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Locations } from "./pages/Locations";
import { Contact } from "./pages/Contact";
import { Kids } from "./pages/Kids";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Partners } from "./pages/Partners";
import { Insurance } from "./pages/Insurance";
import { PriceList } from "./pages/PriceList";
import { Doctors } from "./pages/Doctors";
import { Appointment } from "./pages/Appointment";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "about", Component: About },
      { path: "locations", Component: Locations },
      { path: "contact", Component: Contact },
      { path: "kids", Component: Kids },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      { path: "partners", Component: Partners },
      { path: "insurance", Component: Insurance },
      { path: "prices", Component: PriceList },
      { path: "doctors", Component: Doctors },
      { path: "randevu", Component: Appointment },
    ],
  },
]);