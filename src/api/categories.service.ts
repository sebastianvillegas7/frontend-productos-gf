import type { ICategory } from "../types/ICategorie";

const BASE_URL = `${import.meta.env.VITE_API_URL}/categorias`;

type CategoryApi = {
  id: string;
  nombre: string;
  descripcion: string;
  color: string | null;
  imagen_url: string;
};

type CategoriesApiResponse = {
  data: CategoryApi[];
  total: number;
};

const mapCategoryFromApi = (category: CategoryApi): ICategory => ({
  id: String(category.id),
  name: category.nombre,
  description: category.descripcion,
  color: category.color ?? "",
});

const mapCategoryToApi = (category: Omit<ICategory, "id">) => ({
  nombre: category.name,
  descripcion: category.description,
  color: category.color || null,
  imagen_url: "",
});

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }

  const result: CategoriesApiResponse = await response.json();
  return result.data.map(mapCategoryFromApi);
};

export const createCategory = async (
  newCategory: Omit<ICategory, "id">,
): Promise<ICategory> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapCategoryToApi(newCategory)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al crear la categoría");
  }

  const data: CategoryApi = await response.json();
  return mapCategoryFromApi(data);
};

export const updateCategory = async (
  id: string,
  category: Omit<ICategory, "id">,
): Promise<ICategory> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapCategoryToApi(category)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al actualizar la categoría");
  }

  const data: CategoryApi = await response.json();
  return mapCategoryFromApi(data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al eliminar la categoría");
  }
};