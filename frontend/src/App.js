import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [cedentes, setCedentes] = useState([]);

  useEffect(() => {
    api.get("/cedentes")
      .then((response) => {
        setCedentes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar cedentes:", error);
      });
  }, []);

  return (
    <div>
      <h1>Disparador de Webhooks</h1>
      <h2>Cedentes</h2>
      <ul>
        {cedentes.map((c) => (
          <li key={c.id}>{c.nome} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;