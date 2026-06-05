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
import SearchPage from "./pages/search-page";
import DetailPage from "./pages/detail-page";
import AiPage from "./pages/ai-page";
import AiResultPage from "./pages/ai-result-page";
import ReviewPropertySelectPage from "./pages/review/property-select-page";
import OcrCertificationPage from "./pages/review/ocr-certification-page";
import OcrSuccessPage from "./pages/review/ocr-success-page";
import ReviewContractPage from "./pages/review/review-contract-page";
import WriteReviewPage from "./pages/review/write-review-page";
import MyPage from "./pages/my-page";
import MyLikesPage from "./pages/my-likes-page";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "detail", element: <DetailPage /> },
      { path: "ai", element: <AiPage /> },
      { path: "ai/result", element: <AiResultPage /> },
      { path: "reviews/select", element: <ReviewPropertySelectPage /> },
      { path: "reviews/ocr", element: <OcrCertificationPage /> },
      { path: "reviews/ocr/success", element: <OcrSuccessPage /> },
      { path: "reviews/contract", element: <ReviewContractPage /> },
      { path: "reviews/write", element: <WriteReviewPage /> },
    ],
  },
];

const registerRoutes: RouteObject[] = [
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

const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/my", element: <MyPage /> },
      { path: "/my/likes", element: <MyLikesPage /> },
    ],
  },
];

const router = createBrowserRouter([
  ...publicRoutes,
  ...registerRoutes,
  ...protectedRoutes,
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
