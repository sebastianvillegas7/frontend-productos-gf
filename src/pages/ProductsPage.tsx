import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StockBadge } from "../components/StockBadge/StockBadge";
import type { IProduct } from "../types/IProduct";
import type { ICategory } from "../types/ICategorie";
import { createProduct, getProducts, updateProduct } from "../api/product.service";
import { getCategories } from "../api/categories.service";
import { ProductModal } from "../components/modals/ModalProducts/ModalProducts";

export const ProductsPage = () => {
  //estados
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [productActive, setProductActive] = useState<IProduct | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  //hooks
  const navigate = useNavigate();
  

  //funcionalidades
  const handleCloseModal = () => {
    setOpenModal(false);
    setProductActive(null);
  };

  const handleOpenModal = (product: IProduct | null = null) => {
    setProductActive(product);
    setOpenModal(true);
  };

  //========CREATE======
  const handleCreate = async (newProduct: Omit<IProduct,"id">)=>{
    try {
      const data = await createProduct(newProduct);
      //la correcta
      setProducts((prev) => [...prev, data]); //[todos los productos cargados, nuevo producto]
      //la incorrecta
      //creo el producto
      //fetchProducts()
    } catch (error) {
      setError("Hubo un error al crear")

    }
  }

  //=======UPDATE
  const handleUpdate = async (id:string,newProduct: Omit<IProduct, "id">) => {
    //const statePrevious = products; //estado de state
    try {
      const data = await updateProduct(id, newProduct);
      //[1,2,3,4,5,nuevoElemento, 8 9,]
      const updatedProductos = products.map((product)=>{
        if(product.id === id){
          return data; /// del elemento del array actuale las props
        }else{
          return product
        }
      })
      setProducts(updatedProductos);
    } catch (error) {
      //setProducts(statePrevious);
      setError("Hubo un error al crear");
    }
  };

  //carga inicial al final de la logica
  const fetchProducts = async () => {
    setLoading(true);
    try {
      //promiseAll
      const allProducts = await getProducts();
      setProducts(allProducts);
      const allCategories = await getCategories();
      setCategories(allCategories);
    } catch (error) {
      setError("Hubo un error en la llamada intenta nuevamente");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Encabezado */}
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

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            // TODO: value={search} onChange={...}
            placeholder="Buscar producto..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Producto</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-right font-medium">Precio</th>
                <th className="px-4 py-3 text-center font-medium">Stock</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  {/* Producto */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-3 text-gray-500">
                    {categories.find((c) => c.id == product.categoryId)?.name ??
                      "—"}
                  </td>

                  {/* Precio */}
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    ${product.price.toLocaleString("es-AR")}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 text-center">
                    <StockBadge stock={product.stock} />
                  </td>

                  {/* Acciones */}
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
                      <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
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
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
};
