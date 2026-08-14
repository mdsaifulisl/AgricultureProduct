import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './utils/ScrollToTop';

export default function App() {
  // Redux থেকে পরবর্তীতে Auth State আনা হবে:
  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}