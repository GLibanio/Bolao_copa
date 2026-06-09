import { useState } from "react";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Bolao from "./pages/Bolao";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
  const { usuario } = useAuth();

  // 🔥 HOME ABRE POR PADRÃO
  const [telaAtual, setTelaAtual] = useState("home");

  // Não logado
  if (!usuario) {
    return telaAtual === "cadastro" ? (
      <Cadastro mudarTela={setTelaAtual} />
    ) : (
      <Login mudarTela={setTelaAtual} />
    );
  }

  // Admin
  if (usuario.admin) {
    return (
      <Admin
        voltar={() => {
          localStorage.removeItem("usuarioLogado");
          window.location.reload();
        }}
      />
    );
  }

  // Usuário comum
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <Navbar
        telaAtual={telaAtual}
        mudarTela={setTelaAtual}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {telaAtual === "home" && <Home />}

        {telaAtual === "bolao" && <Bolao />}
      </div>
    </div>
  );
}

export default App;