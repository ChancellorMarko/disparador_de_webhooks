import React, { useState, useEffect } from "react";
import api from "../services/api";  
import "../styles/Protocolos.css";  
import { getProtocolos } from "../services/protocolosService"; 

function Protocolos() {
  const [protocolos, setProtocolos] = useState([]); 
  useEffect(() => {
    api.get('/protocolos') 
      .then(response => setProtocolos(response.data))  
      .catch(error => console.log(error));  
  }, []);  

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