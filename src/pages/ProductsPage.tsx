import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { StockBadge } from "../components/StockBadge/StockBadge";
import type { IProduct, IProductPayload } from "../types/IProduct";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/product.service";
import { getCategories } from "../api/categories.service";
import { ProductModal } from "../components/modals/ModalProducts/ModalProducts";
import type { ICategory } from "../types/ICategorie";
import type { IIngredient } from "../types/IIngredient";
import { getIngredients } from "../api/ingredients.service";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [productActive, setProductActive] = useState<IProduct | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductActive(null);
  };

  const handleOpenModal = (product: IProduct | null = null) => {
    setProductActive(product);
    setOpenModal(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setDeleteError("");
  };

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: ingredients = [],
    isLoading: isLoadingIngredients,
    isError: isErrorIngredients,
  } = useQuery<IIngredient[]>({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: string;
      product: IProductPayload;
    }) => updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleCloseDeleteModal();
    },
    onError: (error: Error) => {
      setDeleteError(error.message || "No se pudo eliminar el producto.");
    },
  });

  const handleCreate = async (newProduct: IProductPayload) => {
    await createMutation.mutateAsync(newProduct);
  };

  const handleUpdate = async (id: string, newProduct: IProductPayload) => {
    await updateMutation.mutateAsync({ id, product: newProduct });
  };

  const handleDeleteClick = (product: IProduct) => {
    setDeleteError("");
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete.id);
  };

  if (isLoadingProducts || isLoadingCategories || isLoadingIngredients) {
    return <p>Cargando productos...</p>;
  }

  if (isErrorProducts || isErrorCategories || isErrorIngredients) {
    return <p>Hubo un error al cargar los datos.</p>;
  }

  return (
    <>
      <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} productos en total
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Nuevo producto
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Imagen</th>
                <th className="px-4 py-3 text-left font-medium">Producto</th>
                <th className="px-4 py-3 text-left font-medium">Categorías</th>
                <th className="px-4 py-3 text-left font-medium">Ingredientes</th>
                <th className="px-4 py-3 text-right font-medium">Precio</th>
                <th className="px-4 py-3 text-center font-medium">Stock</th>
                <th className="px-4 py-3 text-center font-medium">Estado</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[280px]">
                        {product.description || "Sin descripción"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {product.categories.length > 0 ? (
                        product.categories.map((item) => (
                          <span
                            key={`${product.id}-cat-${item.categoria.id}`}
                            style={{
                              backgroundColor: item.categoria.color || "#E5E7EB",
                            }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800"
                          >
                            {item.categoria.name}
                            {item.es_principal ? " ★" : ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {product.ingredients.length > 0 ? (
                        product.ingredients.map((item) => (
                          <span
                            key={`${product.id}-ing-${item.ingrediente.id}`}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.ingrediente.isAllergen
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.ingrediente.name}
                            {item.es_removible ? " (removible)" : ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    ${product.price.toLocaleString("es-AR")}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <StockBadge stock={product.stock} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.available ? "Disponible" : "No disponible"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => handleOpenModal(product)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium text-gray-600">
                No hay productos todavía
              </p>
              <p className="text-sm mt-1">
                Creá el primero haciendo clic en "Nuevo producto"
              </p>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <ProductModal
          handleCloseModal={handleCloseModal}
          productActive={productActive}
          categories={categories}
          ingredients={ingredients}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
        />
      )}

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirmar eliminación
              </h2>
              <button
                onClick={handleCloseDeleteModal}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-gray-700">
                ¿Seguro que querés eliminar el producto{" "}
                <span className="font-semibold">"{productToDelete.name}"</span>?
              </p>

              {deleteError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};