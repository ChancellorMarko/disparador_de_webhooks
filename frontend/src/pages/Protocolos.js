import React, { useState, useEffect } from "react";
import api from "../services/api";  // Importando a instância de API
import "../styles/Protocolos.css";  // Estilos
import { getProtocolos } from "../services/protocolosService"; 

function Protocolos() {
  const [protocolos, setProtocolos] = useState([]); // Armazena os dados

  useEffect(() => {
    api.get('/protocolos')  // Chama a API para buscar os dados reais
      .then(response => setProtocolos(response.data))  // Atualiza com os dados reais
      .catch(error => console.log(error));  // Exibe erro caso haja algum problema
  }, []);  // A chamada vai acontecer uma vez quando o componente for carregado

  return (
    <div className="protocolos-container">
      <h2>Protocolos</h2>
      <table className="protocolos-table">
        <thead>
          <tr>
            <th>UUID</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {protocolos.map((protocolo) => (
            <tr key={protocolo.id}>
              <td>{protocolo.uuid}</td>
              <td>{protocolo.status}</td>
              <td>{protocolo.criadoEm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Protocolos;