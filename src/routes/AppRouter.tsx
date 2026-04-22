import { Route, Routes } from "react-router-dom";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { NavBar } from "../components/NavBar/NavBar";
import { CategoryPage } from "../pages/CategoryPage";

export const AppRouter = () => {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoryPage />} />
        </Routes>
      </main>
    </>
  );
};
