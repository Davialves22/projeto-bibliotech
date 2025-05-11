import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./views/home/Home";
import FormLivro from "./views/produto/FormLivro";
import ListLivro from "./views/produto/ListLivro";

function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="form-livro" element={<FormLivro />} />
        <Route path="list-livro" element={<ListLivro />} />
      </Routes>
    </>
  );
}

export default Rotas;
