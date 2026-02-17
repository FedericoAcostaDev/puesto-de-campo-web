import Papa from 'papaparse';
import { Product } from '../types';

/**
 * Cargamos la URL desde las variables de entorno (.env).
 */
const SHEET_URL = import.meta.env.VITE_SHEET_URL;

// Definimos la constante de la imagen por defecto para fácil mantenimiento
const DEFAULT_IMAGE = '/products/no-image.jpeg';

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  if (!SHEET_URL) {
    console.error("Error: La variable VITE_SHEET_URL no está definida en el archivo .env");
    return [];
  }

  try {
    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }

    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleanData = (results.data as any[])
            .filter(p => p.name && p.id)
            .map(p => ({
              id: String(p.id),
              name: String(p.name),
              description: p.description || '',
              price: Number(p.price) || 0,
              // CAMBIO AQUÍ: Verificamos si existe la imagen y si no es un string vacío
              image: (p.image && String(p.image).trim() !== '') 
                ? p.image 
                : DEFAULT_IMAGE,
              category: p.category || 'General',
              weight: String(p.weight || '')
            }));
            
          resolve(cleanData as Product[]);
        },
        error: (error: Error) => {
          console.error("Error al parsear el CSV de Google Sheets:", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error crítico al obtener productos:", error);
    return [];
  }
};