import React, { useState, useEffect } from "react";
import api from "../services/api";  
import "../styles/Convenios.css";  
import { getConvenios } from "../services/conveniosService"; 

function Convenios() {
  const [convenios, setConvenios] = useState([]); 

  useEffect(() => {
    api.get('/convenios')  
      .then(response => setConvenios(response.data))  
      .catch(error => console.log(error));  
  }, []);  

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