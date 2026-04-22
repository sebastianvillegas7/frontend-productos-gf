import type { IProduct } from "../types/IProduct";

const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(BASE_URL);
    const data: IProduct[] = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

export const getProductsById = async (id: string): Promise<IProduct> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data: IProduct = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

export const createProduct = async (
  newProduct: Omit<IProduct, "id">,
): Promise<IProduct> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data: IProduct = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

export const updateProduct = async (
  id: string,
  product: Omit<IProduct, "id">,
): Promise<IProduct> => {
  try {
    //variar segun su api
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const data: IProduct = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // return error
  }
};

//delete
