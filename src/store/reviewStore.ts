import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReviewType = "resident" | "inspection";

interface Property {
  id: number;
  name: string;
  address: string;
}

interface ContractInfo {
  leaseType: string;
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
  duration: string;
}

interface Ratings {
  house: number;
  facility: number;
  infrastructure: number;
  security: number;
  environment: number;
  total: number;
}

interface ReviewState {
  selectedProperty: Property | null;
  reviewType: ReviewType | null;
  contractInfo: ContractInfo;
  ratings: Ratings;
  detailedReview: string;
  photos: string[];
  photoFiles: File[];

  // Actions
  setSelectedProperty: (property: Property | null) => void;
  setReviewType: (type: ReviewType | null) => void;
  setContractInfo: (info: Partial<ContractInfo>) => void;
  setRating: (key: keyof Ratings, value: number) => void;
  setDetailedReview: (review: string) => void;
  setPhotos: (photos: string[]) => void;
  setPhotoFiles: (files: File[]) => void;
  resetReview: () => void;
}

const initialState = {
  selectedProperty: null,
  reviewType: null,
  contractInfo: {
    leaseType: "",
    deposit: "",
    monthlyRent: "",
    maintenanceFee: "",
    duration: "",
  },
  ratings: {
    house: 0,
    facility: 0,
    infrastructure: 0,
    security: 0,
    environment: 0,
    total: 0,
  },
  detailedReview: "",
  photos: [],
  photoFiles: [],
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedProperty: (property) => set({ selectedProperty: property }),
      setReviewType: (type) => set({ reviewType: type }),
      setContractInfo: (info) =>
        set((state) => ({
          contractInfo: { ...state.contractInfo, ...info },
        })),
      setRating: (key, value) =>
        set((state) => ({
          ratings: { ...state.ratings, [key]: value },
        })),
      setDetailedReview: (detailedReview) => set({ detailedReview }),
      setPhotos: (photos) => set({ photos }),
      setPhotoFiles: (photoFiles) => set({ photoFiles }),
      resetReview: () => set(initialState),
    }),
    {
      name: "review-storage",
      version: 1,
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { photoFiles, ...rest } = state;
        return rest;
      },
    }
  )
);
