
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hookah' | 'coal' | 'flavor' | 'accessory' | string;
  imageUrl: string;
  imageHint: string;
  brand: string;
  stockQuantity: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
  resumeData?: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  createdAt: string;
}
