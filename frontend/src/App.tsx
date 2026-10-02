import { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './utils/ScrollToTop';
import { useAuth } from './features/auth/useAuth';

export default function App() {
  const { getProfile } = useAuth();
  const isFetched = useRef(false);
  
  useEffect(() => {
    if (!isFetched.current) {
      isFetched.current = true;
      getProfile().catch(() => {
        // Unauthenticated ইউজারের জন্য ৪MD বা ৪০১ সাইলেন্টলি ইগনোর করবে
      });
    }
  }, [getProfile]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}