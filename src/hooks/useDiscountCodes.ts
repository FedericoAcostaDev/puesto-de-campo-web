import { useQuery } from '@tanstack/react-query';
import { fetchDiscountCodesFromSheet } from '@/services/productService';
import { DiscountCode } from '@/types';

export const useDiscountCodes = (): {
  discountCodes: DiscountCode[];
  loading: boolean;
  error: string | null;
} => {
  const { data, isLoading, isError } = useQuery<DiscountCode[], Error>({
    queryKey: ['discount-codes'],
    queryFn: fetchDiscountCodesFromSheet,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  });

  return {
    discountCodes: data ?? [],
    loading: isLoading,
    error: isError ? 'No se pudieron cargar los códigos de descuento.' : null,
  };
};
