import React, { useState } from "react";
import "../styles/Cadastro.css";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!nome || !email || !senha || !confirmarSenha) {
            setError("Preencha todos os campos.");
            return;
        }
        if (senha !== confirmarSenha) {
            setError("Senhas divirgentes.");
            return;
        }
        setLoading(true);
        try {
            // Aqui você faria a chamada para a API de cadastro
            // await api.post("/cadastro", { nome, email, senha });
            setSuccess("Cadastro realizado com sucesso! Faça login.");
            setNome(""); setEmail(""); setSenha(""); setConfirmarSenha("");
        } catch (err) {
            setError("Erro ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">
                <h2 className="cadastro-title">Cadastro de Usuário</h2>
                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <label htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirmarSenha"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                    {error && <div className="cadastro-error">{error}</div>}
                    {success && <div className="cadastro-success">{success}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
                <div className="cadastro-login-link">
                    <span>Já tem uma conta?</span>
                    <a href="/login">Faça login</a>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;
