import React, { useState, useEffect } from "react"; // Adiciona os imports necessários
import "../styles/Cedentes.css"; 
import api from "../services/api";
import { getCedentes } from "../services/cedentesService"; 

function Cedentes() {
  const [cedentes, setCedentes] = useState([]); // Estado para armazenar os dados

  useEffect(() => {
    // Chama a API para pegar os dados reais
    api.get('/cedentes') // Chama o endpoint que você configurou
      .then(response => setCedentes(response.data))  // Atualiza o estado com os dados reais
      .catch(error => console.log(error));  // Em caso de erro, exibe no console
  }, []); // O array vazio [] garante que a chamada à API aconteça apenas uma vez quando o componente carregar

  return (
    <div className="cedentes-container">
      <h2>Cedentes</h2>
      <table className="cedentes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {cedentes.map((cedente) => (
            <tr key={cedente.id}>
              <td>{cedente.nome}</td>
              <td>{cedente.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cedentes;