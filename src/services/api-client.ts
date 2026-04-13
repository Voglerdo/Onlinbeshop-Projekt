
/**
 * @fileOverview Zentraler API-Client für die Kommunikation mit einem externen REST-Backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API-Anfrage fehlgeschlagen: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) as T : null as T;
  } catch (error) {
    console.error(`REST-API Fehler (${method} ${endpoint}):`, error);
    throw error;
  }
}

export const externalApiService = {
  // Produkte
  getProducts: () => apiRequest<any[]>('/products'),
  getProduct: (id: string) => apiRequest<any>(`/products/${id}`),
  syncProduct: (productData: any) => apiRequest<any>('/products', 'POST', productData),
  deleteProduct: (id: string) => apiRequest<any>(`/products/${id}`, 'DELETE'),
  
  // Bestellungen
  getOrders: (userId: string) => apiRequest<any[]>(`/users/${userId}/orders`),
  syncOrder: (orderData: any) => apiRequest<any>('/orders', 'POST', orderData),
  
  // Karriere & Bewerbungen
  getJobs: () => apiRequest<any[]>('/jobs'),
  getJob: (id: string) => apiRequest<any>(`/jobs/${id}`),
  syncJob: (jobData: any) => apiRequest<any>('/jobs', 'POST', jobData),
  deleteJob: (id: string) => apiRequest<any>(`/jobs/${id}`, 'DELETE'),
  syncApplication: (appData: any) => apiRequest<any>('/applications', 'POST', appData),
  
  // Reviews
  getReviews: (productId: string) => apiRequest<any[]>(`/products/${productId}/reviews`),
  syncReview: (reviewData: any) => apiRequest<any>('/reviews', 'POST', reviewData),

  // Profil
  getUserProfile: (userId: string) => apiRequest<any>(`/users/${userId}`),
  updateUserProfile: (userId: string, data: any) => apiRequest<any>(`/users/${userId}`, 'PUT', data),
};
