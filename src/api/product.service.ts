import type { IProduct, IProductPayload } from "../types/IProduct";

const BASE_URL = `${import.meta.env.VITE_API_URL}/productos`;

type ProductApiCategory = {
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    color: string | null;
    parent_id: number | null;
  };
  es_principal: boolean;
};

type ProductApiIngredient = {
  ingrediente: {
    id: number;
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
  };
  es_removible: boolean;
};

type ProductApi = {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categorias: ProductApiCategory[];
  ingredientes: ProductApiIngredient[];
};

type ProductsApiResponse = {
  data: ProductApi[];
  total: number;
};

const mapProductFromApi = (product: ProductApi): IProduct => ({
  id: String(product.id),
  name: product.nombre,
  description: product.descripcion,
  price: Number(product.precio_base),
  images: product.imagenes_url ?? [],
  stock: product.stock_cantidad,
  available: product.disponible,
  categories: (product.categorias ?? []).map((item) => ({
    categoria: {
      id: String(item.categoria.id),
      name: item.categoria.nombre,
      description: item.categoria.descripcion,
      color: item.categoria.color ?? "",
    },
    es_principal: item.es_principal,
  })),
  ingredients: (product.ingredientes ?? []).map((item) => ({
    ingrediente: {
      id: String(item.ingrediente.id),
      name: item.ingrediente.nombre,
      description: item.ingrediente.descripcion,
      isAllergen: item.ingrediente.es_alergeno,
    },
    es_removible: item.es_removible,
  })),
});

const mapProductToApi = (product: IProductPayload) => ({
  nombre: product.name,
  descripcion: product.description,
  precio_base: product.price,
  imagenes_url: product.images,
  stock_cantidad: product.stock,
  disponible: product.available,
  categorias: product.categories.map((item) => ({
    categoria_id: Number(item.categoria_id),
    es_principal: item.es_principal,
  })),
  ingredientes: product.ingredients.map((item) => ({
    ingrediente_id: Number(item.ingrediente_id),
    es_removible: item.es_removible,
  })),
});

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  const result: ProductsApiResponse = await response.json();
  return result.data.map(mapProductFromApi);
};

export const getProductsById = async (id: string): Promise<IProduct> => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al obtener el producto");
  }

  const data: ProductApi = await response.json();
  return mapProductFromApi(data);
};

export const createProduct = async (
  newProduct: IProductPayload,
): Promise<IProduct> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapProductToApi(newProduct)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al crear el producto");
  }

  const data: ProductApi = await response.json();
  return mapProductFromApi(data);
};

export const updateProduct = async (
  id: string,
  product: IProductPayload,
): Promise<IProduct> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapProductToApi(product)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al actualizar el producto");
  }

  const data: ProductApi = await response.json();
  return mapProductFromApi(data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al eliminar el producto");
  }
};