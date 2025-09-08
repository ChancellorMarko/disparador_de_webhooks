import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  // fecha o menu quando clicamos em um link
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Disparador</div>

      {/* Botão hamburguer → alterna entre abrir e fechar */}
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Menu */}
      <ul className={`navbar-links ${open ? "open" : ""}`}>
        <li>
          <NavLink
            to="/cedentes"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleLinkClick}
          >
            Cedentes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/convenios"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleLinkClick}
          >
            Convênios
          </NavLink>
        </li>+
        <li>
          <NavLink
            to="/protocolos"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleLinkClick}
          >
            Protocolos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleLinkClick}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
