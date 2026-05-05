import apiClient from './api';

const PRODUCTS_FETCH_TIMEOUT_MS = 12_000;

const normalizeProduct = (raw = {}) => {
  const sizes = Array.isArray(raw.sizes) ? raw.sizes : [];
  const sizePrices =
    raw.sizePrices && typeof raw.sizePrices === 'object' ? raw.sizePrices : {};

  const basePrice = Number(sizePrices['250 ml'] ?? raw.price ?? 0);

  const id =
    raw.id != null ? String(raw.id) :
    raw._id != null ? String(raw._id) : '';

  const imagePath =
    typeof raw.image === 'string' && raw.image.trim()
      ? raw.image.trim()
      : (typeof raw.image_url === 'string' && raw.image_url.trim()
        ? raw.image_url.trim()
        : '');

  return {
    ...raw,
    id,
    sizes,
    sizePrices,
    price: Number.isNaN(basePrice) ? 0 : basePrice,
    available: Boolean(raw.available),
    gender: raw.gender === 'men' || raw.gender === 'women' ? raw.gender : 'women',
    image: imagePath,
    image_url: imagePath
  };
};

export const getProducts = async () => {
  try {
    const response = await apiClient.get('/api/products', {
      timeout: PRODUCTS_FETCH_TIMEOUT_MS
    });

    const data = response.data;
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/api/products/${encodeURIComponent(id)}`, {
      timeout: PRODUCTS_FETCH_TIMEOUT_MS,
    });

    return normalizeProduct(response.data);
  } catch (error) {
    throw new Error(
      error.normalizedMessage ||
      error.response?.data?.detail ||
      'Failed to fetch product'
    );
  }
};