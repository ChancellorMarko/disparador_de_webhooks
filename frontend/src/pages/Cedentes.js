import React from "react";
import "../styles/Cedentes.css";

function Cedentes() {
  // Mock (depois troca por dados reais da API)
  const cedentes = [
    { id: 1, nome: "Empresa XPTO", email: "contato@xpto.com" },
    { id: 2, nome: "Tech Ltda", email: "suporte@tech.com" },
  ];

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