import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login({ mudarTela }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(email, senha);
    } catch (erro) {
      alert(erro.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#006847 0%, #0057b8 50%, #bf0a30 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#006847",
              fontSize: "2rem",
            }}
          >
            Bolão Copa 2026
          </h1>
  
          <p
            style={{
              color: "#666",
              marginTop: "10px",
            }}
          >
            Faça login para acompanhar seus palpites
          </p>
        </div>
  
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
          />
  
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
          />
  
          <button
            type="submit"
            style={{
              background:
                "linear-gradient(90deg,#006847,#0057b8)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>
  
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Ainda não possui conta?
          </p>
  
          <button
            onClick={() => mudarTela("cadastro")}
            style={{
              background: "transparent",
              border: "2px solid #0057b8",
              color: "#0057b8",
              borderRadius: "12px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;