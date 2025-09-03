import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Disparador</div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/cedentes" activeclassname="active">
            Cedentes
          </NavLink>
        </li>
        <li>
          <NavLink to="/convenios" activeclassname="active">
            Convênios
          </NavLink>
        </li>
        <li>
          <NavLink to="/protocolos" activeclassname="active">
            Protocolos
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" activeclassname="active">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
