export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Gesamte Kollektion' },
  { id: 'hookah', label: 'Wasserpfeifen' },
  { id: 'flavor', label: 'Aromen' },
  { id: 'coal', label: 'Kohle' },
  { id: 'accessory', label: 'Zubehoer' },
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]['id'];
