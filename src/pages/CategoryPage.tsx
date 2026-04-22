import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../api/categories.service";
import { useState } from "react";
import { CategoryModal } from "../components/modals/ModalCategories/ModalCategories";
import type { ICategory } from "../types/ICategorie";
import { CategoryDetailModal } from "../components/modals/CategoryDetailModal/CategoryDetailModal";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; category: ICategory }
  | { type: "detail"; category: ICategory };

export const CategoryPage = () => {
  const queryClient = useQueryClient();
  
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  
  const handleCloseModal = () => {
    setModal({ type: "none" });
  };
  //==========GET
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    //estoy haciendo el get, useState, useEffect todo junto
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, //5 minutos
  });

  //==========CREATE
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError:()=>{
      console.log("Algo salio mal")
    }
  });
  //==========EDIT
  const editMutation = useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: string;
      category: Omit<ICategory, "id">;
    }) => updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  if (isLoading) return <p>Cargando productos</p>;
  if (isError) return <p>Hubo un errror</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {categories.length} categorías en total
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Nueva categoría
          </button>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-center font-medium">Color</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <span
                      style={{ backgroundColor: category.color }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                    >
                      {category.name}
                    </span>
                  </td>

                  {/* Descripción */}
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {category.description || "—"}
                  </td>

                  {/* Color */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        style={{ backgroundColor: category.color }}
                        className="w-4 h-4 rounded-full border border-gray-200"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {category.color}
                      </span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setModal({ type: "detail", category })}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setModal({ type: "edit", category })}
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

          {categories.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🏷️</p>
              <p className="font-medium text-gray-600">
                No hay categorías todavía
              </p>
              <p className="text-sm mt-1">
                Creá la primera haciendo clic en "Nueva categoría"
              </p>
            </div>
          )}
        </div>
      </div>

      {modal.type === "edit" && (
        <CategoryModal
          categoryActive={modal.category} //categoria activa
          //edit
          handleCloseModal={handleCloseModal}
        />
      )}
      {modal.type === "create" && (
        <CategoryModal
          categoryActive={null} //no tengo categoria activa
          //create
          handleCreate={(data) => createMutation.mutate(data)}
          handleCloseModal={handleCloseModal}
        />
      )}

      {modal.type === "detail" && (
        <CategoryDetailModal
          category={modal.category}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};
