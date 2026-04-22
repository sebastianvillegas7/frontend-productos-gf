import type { ICategory } from "../types/ICategorie";

const BASE_URL = `${import.meta.env.VITE_API_URL}/categories`;

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await fetch(BASE_URL);
    const data: ICategory[] = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

export const createCategory = async (
  newCategory: Omit<ICategory, "id">,
): Promise<ICategory> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    const data: ICategory = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

export const updateCategory = async (
  id: string,
  category: Omit<ICategory, "id">,
): Promise<ICategory> => {
  try {
    //variar segun su api
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const data: ICategory = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};
