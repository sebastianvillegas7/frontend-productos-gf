import type { SyntheticEvent } from "react";
import type { IProduct } from "../../../types/IProduct";
import type { ICategory } from "../../../types/ICategorie";
import { useForm } from "../../../hooks/useForm";


type Props = {
  productActive: IProduct | null;
  categories: ICategory[];
  handleCloseModal: VoidFunction;
  handleCreate: (newProduct: Omit<IProduct, "id">) => Promise<void>;
  handleUpdate: (id: string, newProduct: Omit<IProduct, "id">) => Promise<void>;
};

export const ProductModal = ({
  productActive,
  categories,
  handleCloseModal,
  handleCreate,
  handleUpdate,
}: Props) => {
  const { formState, handleChange } = useForm({
    name: productActive ? productActive.name : "",
    description: productActive?.description ?? "",
    price: productActive ? productActive.price.toString() : "",
    stock: productActive ? productActive.stock.toString() : "",
    categoryId: productActive ? productActive.categoryId : "",
  });

  const handleSumbit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const producData: Omit<IProduct, "id"> = {
      name: formState.name,
      description: formState.description,
      price: Number(formState.price),
      stock: Number(formState.stock),
      categoryId: formState.categoryId,
    };
    if (productActive) {
      handleUpdate(productActive.id, producData);
    } else {
      handleCreate(producData);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {productActive ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form id="product-form" onSubmit={handleSumbit}>
          <div className="px-6 py-5 space-y-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Precio y Stock en fila */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formState.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formState.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Categoría
              </label>
              <select
                name="categoryId"
                value={formState.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccioná una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Descripción
              </label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descripción del producto"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {productActive ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
};
