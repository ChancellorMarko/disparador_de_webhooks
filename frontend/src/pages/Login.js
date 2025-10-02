
import React, { useState } from "react";
import "../styles/Login.css";
import api from "../services/api";


function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !senha) {
            setError("Preencha todos os campos.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/login", { email, senha });
            localStorage.setItem("token", response.data.token);
            window.location.href = "/cedentes";
        } catch (err) {
            setError(
                err.response?.data?.error || "Usuário ou senha inválidos. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src="/logo192.png" alt="Logo" className="login-logo" />
                <h2 className="login-title">Acesso ao Sistema</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                    />
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoComplete="current-password"
                    />
                    {error && <div className="login-error">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
                <div className="login-register-link">
                    <a href="/cadastro">Cadastre-se aqui</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
