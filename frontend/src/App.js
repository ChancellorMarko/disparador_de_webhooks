import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cedentes from "./pages/Cedentes";
import Convenios from "./pages/Convenios";
import Protocolos from "./pages/Protocolos";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <h1>Disparador de Webhooks</h1>
      <Navbar />

      <Routes>
        <Route path="/cedentes" element={<Cedentes />} />
        <Route path="/convenios" element={<Convenios />} />
        <Route path="/protocolos" element={<Protocolos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;