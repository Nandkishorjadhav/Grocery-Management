const DEFAULT_API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const CATEGORY_FALLBACKS = {
	Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80',
	Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
	Dairy: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=80',
	Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
	Meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
	Snacks: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=80',
	Beverages: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=1200&q=80',
	Grains: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1200&q=80',
	default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
};

export const getApiBaseUrl = () => DEFAULT_API_URL.replace(/\/api\/?$/, '');

export const isPlaceholderImage = (value) => {
	if (!value || typeof value !== 'string') {
		return true;
	}

	const normalized = value.trim().toLowerCase();
	return (
		normalized === '' ||
		normalized.includes('via.placeholder.com') ||
		normalized.includes('placeholder.com')
	);
};

export const resolveImageUrl = (value) => {
	if (!value || typeof value !== 'string') {
		return null;
	}

	if (isPlaceholderImage(value)) {
		return null;
	}

	const trimmed = value.trim();
	const normalizedPath = trimmed.replace(/\\/g, '/');

	if (normalizedPath.startsWith('data:')) {
		return normalizedPath;
	}

	if (/^https?:\/\//i.test(normalizedPath)) {
		return normalizedPath;
	}

	if (normalizedPath.startsWith('//')) {
		return `https:${normalizedPath}`;
	}

	const baseUrl = getApiBaseUrl();
	const normalized = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

	return `${baseUrl}${normalized}`;
};

export const getCategoryFallbackImage = (category) => CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;

export const extractProductImageUrls = (product) => {
	if (!product) {
		return [];
	}

	const candidates = [
		product.image,
		...(Array.isArray(product.images)
			? product.images.map((entry) => (typeof entry === 'string' ? entry : entry?.url))
			: [])
	];

	return candidates
		.map(resolveImageUrl)
		.filter(Boolean)
		.filter((url, index, array) => array.indexOf(url) === index);
};

export const getProductPrimaryImage = (product, useCategoryFallback = true) => {
	const firstImage = extractProductImageUrls(product)[0];
	if (firstImage) {
		return firstImage;
	}

	return useCategoryFallback ? getCategoryFallbackImage(product?.category) : null;
};
