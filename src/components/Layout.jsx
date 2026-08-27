import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Route dictionary for auto-deriving friendly breadcrumb labels
 */
const ROUTE_LABELS = {
  dashboard: "Dashboard",
  careers: "Career Bank",
  quiz: "Aptitude Assessment",
  results: "Assessment Results",
  media: "Multimedia Center",
  stories: "Success Stories",
  submit: "Submit Story",
  resources: "Resource Library",
  bookmarks: "Saved Bookmarks",
  feedback: "Feedback & Support",
  notifications: "Notifications",
  profile: "Passport Profile",
  admin: "Admin Portal",
  login: "Login",
  register: "Register",
  "design-preview": "Design System Preview",
};

/**
 * Helper to build breadcrumb items from current pathname
 */
function deriveBreadcrumbs(pathname) {
  if (!pathname || pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const items = [{ label: "Home", path: "/" }];

  let accumulatedPath = "";
  segments.forEach((seg, index) => {
    accumulatedPath += `/${seg}`;
    const isLast = index === segments.length - 1;

    // Friendly label lookup or capitalise string
    let label = ROUTE_LABELS[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);

    // If segment is an ID or number, make it "Item Details" or numeric
    if (!isNaN(seg) || seg.length > 15) {
      const parentSeg = segments[index - 1];
      if (parentSeg === "careers") label = "Career Details";
      else if (parentSeg === "media") label = "Media Details";
      else if (parentSeg === "results") label = "Results Details";
      else label = `Details`;
    }

    items.push({
      label,
      path: isLast ? undefined : accumulatedPath,
    });
  });

  return items;
}

export default function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const breadcrumbItems = isHomePage || isAuthPage ? [] : deriveBreadcrumbs(location.pathname);

  if (isAuthPage) {
    return (
      <main className="w-full min-h-screen bg-base text-text-primary">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col theme-transition">
      {/* Global navbar hidden on home — hero has its own minimal nav */}
      {!isHomePage && <Navbar />}

      <main className="flex-1 w-full">
        {!isHomePage && breadcrumbItems.length > 1 && (
          <div className="container-app pt-6 pb-2">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}
