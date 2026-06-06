import type { Property } from "../pages/search-page";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type PropertySearchItem = {
  id: number;
  propertyName: string;
  propertyAddress?: string;
};

type PropertySearchDto = {
  id?: number;
  propertyId?: number;
  transactionType?: "월세" | "전세";
  propertyName?: string;
  averageTotalScore?: number;
  reviewCount?: number;
  "property-address"?: string;
  address?: string;
};

export async function searchProperties(name: string): Promise<Property[]> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/api/v1/properties?name=${encodeURIComponent(name)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`매물 검색 실패: ${response.status}`);
  }

  const data = (await response.json()) as ApiResponse<
    PropertySearchDto[] | PropertySearchDto
  >;

  const rawResult = data.result;

  const resultArray = Array.isArray(rawResult)
    ? rawResult
    : rawResult
      ? [rawResult]
      : [];

  return resultArray
    .map((item) => ({
      id: item.id ?? item.propertyId ?? 0,
      rentType: item.transactionType ?? "월세",
      title: item.propertyName ?? "",
      rating: item.averageTotalScore ?? 0,
      reviewCount: item.reviewCount ?? 0,
      address: item["property-address"] ?? item.address ?? "",
      isLiked: false,
    }))
    .filter((item) => item.id !== 0);
}

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

async function request<T>(url: string): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
}

export async function getPropertyDetail(
  propertyId: number,
): Promise<PropertyDetail> {
  const data = await request<PropertyDetailDto>(
    `/api/v1/properties/${propertyId}`,
  );

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
  const data = await request<PropertyImageDto[]>(
    `/api/v1/properties/${propertyId}/images`,
  );

  return data.map((image) => ({
    id: image.id,
    imageUrl: image.image_url,
  }));
}
