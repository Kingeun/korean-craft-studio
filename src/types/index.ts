export type CraftType = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface Craft {
  id: string;
  name: string;
  craftType: CraftType;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
}

export interface CraftClass {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  maxCapacity: number;
  imageSrc: string;
  imageAlt: string;
}

export interface OrderInquiry {
  name: string;
  contact: string;
  craftId: string;
  quantity: number;
  request: string;
}

export interface ClassApplication {
  name: string;
  contact: string;
  classId: string;
  preferredDate: string;
  participantCount: number;
  request: string;
}

export type MockApiResult =
  | { success: true; receiptNumber: string; message: string }
  | { success: false; message: string };
