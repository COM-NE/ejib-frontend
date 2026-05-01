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

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "register/nickname", element: <NicknamePage /> },
      { path: "register/profile", element: <ProfilePage /> },
      { path: "register/status", element: <StatusPage /> },
      { path: "register/requirement", element: <RequirementPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
