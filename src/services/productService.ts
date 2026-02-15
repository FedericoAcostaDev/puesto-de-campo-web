import Papa from 'papaparse';
import { Product } from '../types';

/**
 * Cargamos la URL desde las variables de entorno (.env).
 * En Vite debe empezar con VITE_ para ser accesible en el cliente.
 */
const SHEET_URL = import.meta.env.VITE_SHEET_URL;

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  // Validación de seguridad por si olvidaste configurar el .env
  if (!SHEET_URL) {
    console.error("Error: La variable VITE_SHEET_URL no está definida en el archivo .env");
    return [];
  }

  try {
    // 1. Obtenemos los datos crudos (CSV) de Google Sheets
    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }

    const csvText = await response.text();
    
    // 2. Procesamos el CSV con PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,         // Usa la primera fila como nombres de propiedades
        dynamicTyping: true,  // Convierte automáticamente números (precio)
        skipEmptyLines: true, // Ignora filas en blanco
        complete: (results) => {
          // 3. Limpieza y formateo de datos
          const cleanData = (results.data as any[])
            .filter(p => p.name && p.id) // Solo productos con nombre e ID
            .map(p => ({
              id: String(p.id), // Aseguramos que el ID sea string
              name: String(p.name),
              description: p.description || '',
              price: Number(p.price) || 0,
              image: p.image || '/products/placeholder.jpg', // Imagen por defecto
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