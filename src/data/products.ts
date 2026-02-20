import { Product } from "@/contexts/CartContext";

/**
 * Función para limpiar y obtener categorías únicas de los productos del Sheet.
 * Elimina duplicados, valores vacíos y ordena alfabéticamente.
 */
export const getDynamicCategories = (products: Product[]): string[] => {
  if (!products || !Array.isArray(products)) return ["Todos"];

  const categoriesRaw = products
    .map((p) => p.category)
    .filter((cat): cat is string => Boolean(cat) && cat.trim() !== "");

  // Usamos Set para eliminar duplicados
  const uniqueCategories = Array.from(new Set(categoriesRaw));

  // Retornamos 'Todos' al principio y el resto ordenado
  return ["Todos", ...uniqueCategories.sort((a, b) => a.localeCompare(b))];
};

/**
 * URL de tu Google Apps Script o API de Sheets.
 * Asegúrate de que esta URL sea la que devuelve el JSON de tus productos.
 */
const GOOGLE_SHEET_URL = import.meta.env.VITE_SHEET_URL;

/**
 * Servicio para obtener los productos.
 * Esta es la función que debe usar tu useQuery en el hook.
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);

    if (!response.ok) {
      throw new Error(
        `Error al conectar con Google Sheets: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Verificación de estructura: Google Sheets a veces devuelve los datos
    // dentro de un objeto. Ajustamos para devolver siempre un array.
    const productsArray = Array.isArray(data) ? data : data.products || [];

    // Mapeo preventivo para asegurar que los tipos sean correctos
    return productsArray.map((p: any) => ({
      ...p,
      id: p.id?.toString() || Math.random().toString(36).substr(2, 9),
      price: Number(p.price) || 0,
      image: p.image || "/placeholder-meat.jpg", // Imagen por defecto si falta
      category: p.category || "General",
    }));
  } catch (error) {
    console.error("Error en getProducts:", error);
    // En caso de error crítico, devolvemos array vacío para no romper la app
    return [];
  }
};

/**
 * NOTA: Ya no exportamos la constante 'categories' estática
 * para obligar a la Tienda a usar getDynamicCategories(products).
 */
