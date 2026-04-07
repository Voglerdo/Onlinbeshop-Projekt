
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
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Hier könnten später Auth-Tokens für das Spring Boot Backend hinzugefügt werden
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API-Anfrage fehlgeschlagen: ${response.status}`);
  }

  return response.json();
}

export const externalApiService = {
  // Beispiel: Produkte von externer API laden
  getProducts: () => apiRequest<any[]>('/products'),
  
  // Beispiel: Bestellung an externes Backend synchronisieren
  syncOrder: (orderData: any) => apiRequest<any>('/orders', 'POST', orderData),
  
  // Beispiel: Bewerbung synchronisieren
  syncApplication: (appData: any) => apiRequest<any>('/applications', 'POST', appData),
};
