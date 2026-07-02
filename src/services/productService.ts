import Papa from 'papaparse';
import { Product } from '../types';
import { createSlug } from '../lib/utils';

/**
 * Cargamos la URL desde las variables de entorno (.env).
 */
const SHEET_URL = import.meta.env.VITE_SHEET_URL;

// Definimos la constante de la imagen por defecto
const DEFAULT_IMAGE = '/products/no-image.jpeg';

/**
 * Función auxiliar para limpiar y formatear URLs de Google Drive.
 * Convierte enlaces de compartir o de exportación en enlaces directos de imagen.
 */
const formatDriveUrl = (url: string): string => {
  if (!url) return DEFAULT_IMAGE;
  
  // Si no es un link de Google Drive, lo devolvemos tal cual (por si usas otros hostings)
  if (!url.includes('drive.google.com')) return url;

  try {
    let imageId = '';

    // Caso 1: URL tipo 'id=1uRn6zcbxtqhDIX-LyTmIBmqFXrHMATE2'
    if (url.includes('id=')) {
      imageId = url.split('id=')[1].split('&')[0];
    } 
    // Caso 2: URL tipo 'file/d/1uRn6zcbxtqhDIX-LyTmIBmqFXrHMATE2/view'
    else if (url.includes('/d/')) {
      imageId = url.split('/d/')[1].split('/')[0];
    }

    return imageId 
      ? `https://lh3.googleusercontent.com/u/0/d/${imageId}` 
      : url;
  } catch (error) {
    console.warn("Error formateando URL de Drive:", error);
    return url;
  }
};

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
            .filter(p => p.name && p.id) // Asegura que el producto tenga datos mínimos
            .map(p => ({
              id: String(p.id),
              slug: createSlug(String(p.name)) || String(p.id),
              name: String(p.name),
              description: p.description || '',
              price: Number(p.price) || 0,
              // Aplicamos la lógica de formateo de imagen aquí
              image: (p.image && String(p.image).trim() !== '') 
                ? formatDriveUrl(String(p.image)) 
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