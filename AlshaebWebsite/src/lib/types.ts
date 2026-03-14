export type StoreItem = {
  id: number;
  nameEn: string;
  nameAr: string;
  category: string;
  descEn: string;
  descAr: string;
  imageUrl: string;
  isFeatured: boolean;
  status: "draft" | "published";
  createdAt: string;
};

export type CreateStoreItemPayload = {
  nameEn: string;
  nameAr: string;
  category: string;
  descEn: string;
  descAr: string;
  imageUrl: string;
  isFeatured: boolean;
  status: "draft" | "published";
};
