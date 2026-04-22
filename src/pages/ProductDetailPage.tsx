import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IProduct } from "../types/IProduct";
import type { ICategory } from "../types/ICategorie";
import { getProductsById } from "../api/product.service";
import { getCategories } from "../api/categories.service";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<IProduct | null>(null);

  const [categories, setCategories] = useState<ICategory[]>([]);

  const getData = async (id: string) => {
    try {
      const product = await getProductsById(id);
      setProduct(product);
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, []);

  const navigate = useNavigate();

  if (!product) return <h1>No existe el producto</h1>;

  const category = categories.find((c) => c.id === `${product?.categoryId}`);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex flex-col gap-5">
        {/* Categoría */}
        {category && (
          <div>
            <span
              style={{ backgroundColor: category.color }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
            >
              {category.name}
            </span>
          </div>
        )}

        <hr className="border-gray-100" />

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Descripción
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.description || "Sin descripción"}
          </p>
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Precio
            </span>
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Stock
            </span>
            <span
              className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                product.stock === 0
                  ? "bg-red-100 text-red-700"
                  : product.stock <= 5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {product.stock === 0 ? "Sin stock" : `${product.stock} unidades`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
