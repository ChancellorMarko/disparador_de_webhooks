import React, { useState, useEffect } from "react";
import api from "../services/api";  // Importando a instância de API
import "../styles/Convenios.css";  // Estilos
import { getConvenios } from "../services/conveniosService"; 

function Convenios() {
  const [convenios, setConvenios] = useState([]); // Armazena os dados

  useEffect(() => {
    api.get('/convenios')  // Chama a API para buscar os dados reais
      .then(response => setConvenios(response.data))  // Atualiza com os dados reais
      .catch(error => console.log(error));  // Exibe erro caso haja algum problema
  }, []);  // A chamada vai acontecer uma vez quando o componente for carregado

  return (
    <div className="convenios-container">
      <h2>Convênios</h2>
      <table className="convenios-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {convenios.map((convenio) => (
            <tr key={convenio.id}>
              <td>{convenio.nome}</td>
              <td>{convenio.criadoEm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Convenios;