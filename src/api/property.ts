import axiosInstance from "./axiosInstance";
import type { Property } from "../pages/search-page";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// type ApiResponse<T> = {
//   isSuccess: boolean;
//   code: string;
//   message: string;
//   result: T;
// };

export type PropertySearchItem = {
  id: number;
  propertyName: string;
  propertyAddress?: string;
};

type PropertySearchDto = {
  averageTotalScore: number;
  id: number;
  propertyAddress: string;
  propertyName: string;
  reviewCount: number;
  scrapped: boolean;
  transactionType: "월세" | "전세";
};

export type PropertyDetail = {
  agency: string;
  area: number;
  averageTotalScore: number;
  deposit: number;
  description: string;
  distanceToSchool: number;
  floor: number;
  monthlyRent: number;
  propertyAddress: string;
  propertyName: string;
  propertyType: string;
  reviewCount: number;
  transactionType: string;
};

type PropertyDetailDto = {
  agency: string;
  area: number;
  averageTotalScore: number;
  deposit: number;
  description: string;
  distanceToSchool: number;
  floor: number;
  monthlyRent: number;
  "property-address": string;
  propertyName: string;
  propertyType: string;
  reviewCount: number;
  transactionType: string;
};

type PropertyImageDto = {
  id: number;
  image_url: string;
};

export type PropertyImage = {
  id: number;
  imageUrl: string;
};

export type QnaAnswer = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userNickname: string;
};

export type QnaQuestion = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userNickname: string;
  answers: QnaAnswer[];
};

type QnaAnswerDto = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userNickname: string;
};

type QnaQuestionDto = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userNickname: string;
  answers: QnaAnswerDto[];
};

type CreateQnaRequest = {
  content: string;
};

type PropertyScrapDto = {
  scrapped: boolean;
};

// async function request<T>(url: string): Promise<T> {
//   const token = localStorage.getItem("accessToken");

//   const response = await fetch(`${BASE_URL}${url}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`API 요청 실패: ${response.status}`);
//   }

//   return response.json();
// }

export async function searchProperties(name: string): Promise<Property[]> {
  const response = await axiosInstance.get<PropertySearchDto[]>(
    "/api/v1/properties",
    {
      params: {
        name,
      },
    },
  );

  return response.data.map((item) => ({
    id: item.id,
    rentType: item.transactionType,
    title: item.propertyName,
    rating: item.averageTotalScore,
    reviewCount: item.reviewCount,
    address: item.propertyAddress,
    isLiked: item.scrapped,
  }));
}

export async function getPropertyDetail(
  propertyId: number,
): Promise<PropertyDetail> {
  const response = await axiosInstance.get<PropertyDetailDto>(
    `/api/v1/properties/${propertyId}`,
  );

  const data = response.data;

  return {
    agency: data.agency,
    area: data.area,
    averageTotalScore: data.averageTotalScore,
    deposit: data.deposit,
    description: data.description,
    distanceToSchool: data.distanceToSchool,
    floor: data.floor,
    monthlyRent: data.monthlyRent,
    propertyAddress: data["property-address"],
    propertyName: data.propertyName,
    propertyType: data.propertyType,
    reviewCount: data.reviewCount,
    transactionType: data.transactionType,
  };
}

export async function getPropertyImages(
  propertyId: number,
): Promise<PropertyImage[]> {
  const response = await axiosInstance.get<PropertyImageDto[]>(
    `/api/v1/properties/${propertyId}/images`,
  );

  return response.data.map((image) => ({
    id: image.id,
    imageUrl: image.image_url,
  }));
}

export async function getPropertyQna(
  propertyId: number,
): Promise<QnaQuestion[]> {
  const response = await axiosInstance.get<QnaQuestionDto[]>(
    `/api/v1/properties/${propertyId}/qna`,
  );

  return response.data.map((question) => ({
    id: question.id,
    content: question.content,
    createdAt: question.createdAt,
    userId: question.userId,
    userNickname: question.userNickname,
    answers: question.answers.map((answer) => ({
      id: answer.id,
      content: answer.content,
      createdAt: answer.createdAt,
      userId: answer.userId,
      userNickname: answer.userNickname,
    })),
  }));
}

export async function createPropertyQuestion(
  propertyId: number,
  content: string,
): Promise<QnaQuestion> {
  const response = await axiosInstance.post<QnaQuestionDto>(
    `/api/v1/properties/${propertyId}/questions`,
    {
      content,
    } satisfies CreateQnaRequest,
  );

  const question = response.data;

  return {
    id: question.id,
    content: question.content,
    createdAt: question.createdAt,
    userId: question.userId,
    userNickname: question.userNickname,
    answers: question.answers.map((answer) => ({
      id: answer.id,
      content: answer.content,
      createdAt: answer.createdAt,
      userId: answer.userId,
      userNickname: answer.userNickname,
    })),
  };
}

export async function createQuestionAnswer(
  questionId: number,
  content: string,
): Promise<QnaAnswer> {
  const response = await axiosInstance.post<QnaAnswerDto>(
    `/api/v1/questions/${questionId}/answers`,
    {
      content,
    } satisfies CreateQnaRequest,
  );

  const answer = response.data;

  return {
    id: answer.id,
    content: answer.content,
    createdAt: answer.createdAt,
    userId: answer.userId,
    userNickname: answer.userNickname,
  };
}

export async function togglePropertyScrap(
  propertyId: number,
): Promise<boolean> {
  const response = await axiosInstance.patch<PropertyScrapDto>(
    `/api/v1/properties/${propertyId}/scrap`,
  );

  return response.data.scrapped;
}
