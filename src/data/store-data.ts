import { Sofa, Tv, UtensilsCrossed, Baby, LampFloor, Bath, TreePine } from 'lucide-react';

export const categories = [
  {
    id: 'furniture',
    nameEn: 'Furniture',
    nameAr: 'أثاث',
    icon: Sofa,
    color: 'bg-amber-100 text-amber-700',
    description: 'Transform your living spaces with our elegant collections.'
  },
  {
    id: 'appliances',
    nameEn: 'Home Appliances',
    nameAr: 'أجهزة منزلية',
    icon: Tv,
    color: 'bg-blue-100 text-blue-700',
    description: 'Modern tech to make your daily life effortless.'
  },
  {
    id: 'kitchen',
    nameEn: 'Kitchen & Dining',
    nameAr: 'مطبخ وسفرة',
    icon: UtensilsCrossed,
    color: 'bg-red-100 text-red-700',
    description: 'Everything you need to cook and serve with joy.'
  },
  {
    id: 'kids',
    nameEn: 'Kids & Toys',
    nameAr: 'ألعاب وأطفال',
    icon: Baby,
    color: 'bg-purple-100 text-purple-700',
    description: 'Fun, educational, and safe items for the little ones.'
  },
  {
    id: 'decor',
    nameEn: 'Home Decor',
    nameAr: 'ديكور المنزل',
    icon: LampFloor,
    color: 'bg-teal-100 text-teal-700',
    description: 'The finishing touches that make a house a home.'
  },
  {
    id: 'bathroom',
    nameEn: 'Bathroom',
    nameAr: 'مستلزمات الحمام',
    icon: Bath,
    color: 'bg-sky-100 text-sky-700',
    description: 'Create your personal spa with our bath essentials.'
  },
  {
    id: 'outdoor',
    nameEn: 'Outdoor & Garden',
    nameAr: 'جلسات خارجية',
    icon: TreePine,
    color: 'bg-green-100 text-green-700',
    description: 'Elevate your patio, balcony, or garden.'
  }
];
