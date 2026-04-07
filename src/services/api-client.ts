/**
 * @fileOverview Zentraler API-Client für die Kommunikation mit einem externen REST-Backend.
 * Erlaubt den parallelen Betrieb zu Firebase.
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
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API-Anfrage fehlgeschlagen: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`REST-API Fehler (${method} ${endpoint}):`, error);
    throw error;
  }
}

export const externalApiService = {
  // Produkte
  getProducts: () => apiRequest<any[]>('/products'),
  syncProduct: (productData: any) => apiRequest<any>('/products', 'POST', productData),
  
  // Bestellungen
  syncOrder: (orderData: any) => apiRequest<any>('/orders', 'POST', orderData),
  
  // Karriere & Bewerbungen
  getJobs: () => apiRequest<any[]>('/jobs'),
  syncJob: (jobData: any) => apiRequest<any>('/jobs', 'POST', jobData),
  syncApplication: (appData: any) => apiRequest<any>('/applications', 'POST', appData),
  
  // Reviews
  syncReview: (reviewData: any) => apiRequest<any>('/reviews', 'POST', reviewData),
};
