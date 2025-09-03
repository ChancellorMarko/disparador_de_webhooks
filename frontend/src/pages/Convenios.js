import React from "react";
import "../styles/Convenios.css";

function Convenios() {
  // Mock (vai virar dados da API depois)
  const convenios = [
    { id: 1, nome: "Convênio Saúde", criadoEm: "2024-08-10" },
    { id: 2, nome: "Convênio Empresa X", criadoEm: "2024-09-01" },
  ];

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