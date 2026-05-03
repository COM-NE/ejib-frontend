import {
  type RouteObject,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PublicLayout from "./layouts/public-layout";
import ProtectedLayout from "./layouts/protected-layout";
import LoginPage from "./pages/login-page";
import NicknamePage from "./pages/onboarding/nickname-page";
import ProfilePage from "./pages/onboarding/profile-page";
import StatusPage from "./pages/onboarding/status-page";
import RequirementPage from "./pages/onboarding/requirement-page";
import HomePage from "./pages/home-page";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/register",
    element: <ProtectedLayout />,
    children: [
      { path: "nickname", element: <NicknamePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "status", element: <StatusPage /> },
      { path: "requirement", element: <RequirementPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
