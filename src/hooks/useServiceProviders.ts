import { useState, useEffect, useCallback } from "react";
import { serviceProvidersService } from "@/services/serviceProvidersService";
import type {
  ServiceProvider,
  GetServiceProvidersParams,
  ServiceProvidersResponse,
} from "@/types/serviceProviders";

export interface UseServiceProvidersResult {
  providers: ServiceProvider[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  // Actions
  fetchProviders: (params?: GetServiceProvidersParams) => Promise<void>;
  searchProviders: (
    searchTerm: string,
    filters?: Partial<GetServiceProvidersParams>
  ) => Promise<void>;
  filterByCategory: (
    category: string,
    otherFilters?: Partial<GetServiceProvidersParams>
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useServiceProviders(
  initialParams?: GetServiceProvidersParams
): UseServiceProvidersResult {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentParams, setCurrentParams] = useState<GetServiceProvidersParams>(
    initialParams || { page: 1, limit: 20, sortBy: "rating", sortOrder: "desc" }
  );

  const handleResponse = useCallback(
    (response: ServiceProvidersResponse, append: boolean = false) => {
      if (response.success && response.data) {
        setProviders((prev) =>
          append
            ? [...prev, ...response.data!.providers]
            : response.data!.providers
        );
        setTotal(response.data.total);
        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
        setError(null);
      } else {
        setError(response.message);
        if (!append) {
          setProviders([]);
          setTotal(0);
          setTotalPages(0);
        }
      }
    },
    []
  );

  const fetchProviders = useCallback(
    async (params?: GetServiceProvidersParams) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = params || currentParams;
        setCurrentParams(queryParams);

        const response = await serviceProvidersService.getServiceProviders(
          queryParams
        );
        handleResponse(response, false);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch service providers";
        setError(errorMessage);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    },
    [currentParams, handleResponse]
  );

  const searchProviders = useCallback(
    async (
      searchTerm: string,
      filters?: Partial<GetServiceProvidersParams>
    ) => {
      const searchParams = {
        ...currentParams,
        ...filters,
        search: searchTerm,
        page: 1, // Reset to first page for new search
      };

      await fetchProviders(searchParams);
    },
    [currentParams, fetchProviders]
  );

  const filterByCategory = useCallback(
    async (
      category: string,
      otherFilters?: Partial<GetServiceProvidersParams>
    ) => {
      const filterParams = {
        ...currentParams,
        ...otherFilters,
        category: category === "All Categories" ? undefined : category,
        page: 1, // Reset to first page for new filter
      };

      await fetchProviders(filterParams);
    },
    [currentParams, fetchProviders]
  );

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    try {
      const nextPageParams = {
        ...currentParams,
        page: page + 1,
      };

      const response = await serviceProvidersService.getServiceProviders(
        nextPageParams
      );
      handleResponse(response, true); // Append to existing providers
      setCurrentParams(nextPageParams);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load more providers";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages, currentParams, handleResponse]);

  const refresh = useCallback(async () => {
    await fetchProviders(currentParams);
  }, [fetchProviders, currentParams]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchProviders(initialParams);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // We only want to run this once on mount, not when fetchProviders changes

  return {
    providers,
    loading,
    error,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
    fetchProviders,
    searchProviders,
    filterByCategory,
    loadMore,
    refresh,
    clearError,
  };
}

// Hook for getting a single service provider
export function useServiceProvider(id: string) {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvider = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await serviceProvidersService.getServiceProviderById(id);
      if (response.success && response.data) {
        setProvider(response.data);
      } else {
        setError(response.message);
        setProvider(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch service provider";
      setError(errorMessage);
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  return {
    provider,
    loading,
    error,
    refresh: fetchProvider,
    clearError: () => setError(null),
  };
}
