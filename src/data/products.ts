import { fetchProductsFromSheet } from '@/services/productService';

/**
 * Trae los productos desde Google Sheets
 */
export const getProducts = async () => {
  return await fetchProductsFromSheet();
};

/**
 * Obtiene las categorías únicas basadas en los productos existentes en la DB
 * @param products Lista de productos obtenidos de la base de datos
 */
export const getDynamicCategories = (products: any[]) => {
  // Extraemos todas las categorías
  const categoriesRaw = products.map(p => p.category);
  
  // Usamos 'Set' para eliminar duplicados y convertimos de nuevo a Array
  const uniqueCategories = [...new Set(categoriesRaw)];
  
  // Retornamos 'Todos' primero y luego las categorías encontradas
  return ['Todos', ...uniqueCategories];
};

// Mantenemos esta exportación por si algún componente aún la pide, 
// pero lo ideal es usar la lógica dinámica.
export const categories = ['Todos', 'Vacuno', 'Embutidos', 'Cerdo', 'Achuras'];