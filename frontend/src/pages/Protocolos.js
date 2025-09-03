import React from "react";
import "../styles/Protocolos.css";

function Protocolos() {
  // Mock (depois vira dados reais da API)
  const protocolos = [
    { id: 1, uuid: "123e4567-e89b-12d3-a456-426614174000", status: "Sucesso", criadoEm: "2024-08-20" },
    { id: 2, uuid: "223e4567-e89b-12d3-a456-426614174001", status: "Erro", criadoEm: "2024-08-25" },
  ];

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