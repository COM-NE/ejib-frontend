import {
  type RouteObject,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PublicLayout from "./layouts/public-layout";
import ProtectedLayout from "./layouts/protected-layout";

import LoginPage from "./pages/login-page";
import KakaoSuccessPage from "./pages/kakao-success-page";
import NicknamePage from "./pages/onboarding/nickname-page";
import ProfilePage from "./pages/onboarding/profile-page";
import StatusPage from "./pages/onboarding/status-page";
import RequirementPage from "./pages/onboarding/requirement-page";
import HomePage from "./pages/home-page";
import SearchPage from "./pages/search-page";
import DetailPage from "./pages/detail-page";
import AiPage from "./pages/ai-page";
import AiResultPage from "./pages/ai-result-page";
import ReviewSelectPage from "./pages/review/review-select";
import ReviewOcrPage from "./pages/review/review-ocr";
import ReviewSuccessPage from "./pages/review/review-success";
import ReviewContractPage from "./pages/review/review-contract";
import ReviewWritePage from "./pages/review/review-write";
import MyPage from "./pages/my-page";
import MyLikesPage from "./pages/my-likes-page";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "home", element: <HomePage /> },
      { path: "/oauth/kakao/success", element: <KakaoSuccessPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "/properties/:propertyId", element: <DetailPage /> },
      { path: "ai", element: <AiPage /> },
      { path: "ai/result", element: <AiResultPage /> },
      { path: "reviews/select", element: <ReviewSelectPage /> },
      { path: "reviews/ocr", element: <ReviewOcrPage /> },
      { path: "reviews/ocr/success", element: <ReviewSuccessPage /> },
      { path: "reviews/contract", element: <ReviewContractPage /> },
      { path: "reviews/write", element: <ReviewWritePage /> },
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
