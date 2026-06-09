import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }

    setLoading(false);
  }, []);

  async function login(email, senha) {
    const usuarioLogado = await authService.login(
      email,
      senha
    );

    setUsuario(usuarioLogado);

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioLogado)
    );
  }

  async function cadastro(nome, email, senha) {
    await authService.cadastrar(
      nome,
      email,
      senha
    );
  }

  async function logout() {
    await authService.logout();

    localStorage.removeItem("usuario");

    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        cadastro,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}