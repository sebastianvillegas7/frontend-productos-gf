import type { IIngredient } from "../types/IIngredient";

const BASE_URL = `${import.meta.env.VITE_API_URL}/ingredientes`;

type IngredientApi = {
  id: number;
  nombre: string;
  descripcion: string;
  es_alergeno: boolean;
};

type IngredientsApiResponse = {
  data: IngredientApi[];
  total: number;
};

const mapIngredientFromApi = (ingredient: IngredientApi): IIngredient => ({
  id: String(ingredient.id),
  name: ingredient.nombre,
  description: ingredient.descripcion,
  isAllergen: ingredient.es_alergeno,
});

const mapIngredientToApi = (ingredient: Omit<IIngredient, "id">) => ({
  nombre: ingredient.name,
  descripcion: ingredient.description,
  es_alergeno: ingredient.isAllergen,
});

export const getIngredients = async (): Promise<IIngredient[]> => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los ingredientes");
  }

  const result: IngredientsApiResponse = await response.json();
  return result.data.map(mapIngredientFromApi);
};

export const createIngredient = async (
  newIngredient: Omit<IIngredient, "id">,
): Promise<IIngredient> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapIngredientToApi(newIngredient)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al crear ingrediente");
  }

  const data: IngredientApi = await response.json();
  return mapIngredientFromApi(data);
};

export const updateIngredient = async (
  id: string,
  ingredient: Omit<IIngredient, "id">,
): Promise<IIngredient> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapIngredientToApi(ingredient)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al actualizar ingrediente");
  }

  const data: IngredientApi = await response.json();
  return mapIngredientFromApi(data);
};

export const deleteIngredient = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Error al eliminar ingrediente");
  }
};