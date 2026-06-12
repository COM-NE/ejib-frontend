import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const rawAccessToken = localStorage.getItem("accessToken");

    const accessToken =
      rawAccessToken &&
      rawAccessToken !== "undefined" &&
      rawAccessToken !== "null"
        ? rawAccessToken
        : null;

    const noAuthUrls = [
      "/api/v1/auth/kakao/tokens",
      "/api/v1/auth/kakao/authorize",
    ];

    const isNoAuthRequest = noAuthUrls.some((url) => config.url?.includes(url));

    if (accessToken && !isNoAuthRequest) {
      config.headers.Authorization = accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }

    console.log("[API 요청]", {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL ?? ""}${config.url ?? ""}`,
      headers: config.headers,
      params: config.params,
      data: config.data,
      hasAccessToken: !!accessToken,
      accessTokenPreview: accessToken ? accessToken.slice(0, 20) + "..." : null,
      isNoAuthRequest,
    });

    return config;
  },
  (error) => {
    console.error("[API 요청 설정 실패]", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[API 응답 성공]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    console.error("[API 응답 실패]", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  },
);

export default axiosInstance;
