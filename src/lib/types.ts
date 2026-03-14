export type StoreItem = {
  id: number;
  nameEn: string;
  nameAr: string;
  category: string;
  descEn: string;
  descAr: string;
  imageUrl: string;
  imageUrls: string[];
  price: number;
  onSale: boolean;
  salePrice: number | null;
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
  imageUrls: string[];
  price: number;
  onSale: boolean;
  salePrice: number | null;
  isFeatured: boolean;
  status: "draft" | "published";
};
