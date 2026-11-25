import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ScrollToTop } from "./utils/ScrollToTop";
import { useAuth } from "./features/auth/useAuth";
import DynamicHelmet from "./components/common/DynamicHelmet";

const AUTH_SESSION_HINT_KEY = "rk_has_session";

const hasSessionHint = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_SESSION_HINT_KEY) === "1";
};

export default function App() {
  const { getProfile } = useAuth();
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    if (!hasSessionHint()) return;

    getProfile().catch(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_SESSION_HINT_KEY);
      }
    });
  }, [getProfile]);

  return (
    <BrowserRouter>
      <DynamicHelmet />
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}