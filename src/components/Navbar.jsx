function Navbar({ telaAtual, mudarTela }) {
  return (
    <nav
      style={{
        width: "100%",
        marginBottom: "25px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          background: "#fff",
          padding: "8px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,.1)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => mudarTela("home")}
          style={{
            border: "none",
            cursor: "pointer",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            transition: ".3s",
            background:
              telaAtual === "home"
                ? "linear-gradient(90deg,#006847,#0057b8)"
                : "transparent",
            color:
              telaAtual === "home"
                ? "#fff"
                : "#333",
          }}
        >
          🏆 Home
        </button>

        <button
          onClick={() => mudarTela("mata-mata")}
          style={{
            border: "none",
            cursor: "pointer",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            transition: ".3s",
            background:
              telaAtual === "mata-mata"
                ? "linear-gradient(90deg,#bf0a30,#0057b8)"
                : "transparent",
            color:
              telaAtual === "mata-mata"
                ? "#fff"
                : "#333",
          }}
        >
          ⚔️ Mata-Mata
        </button>

        <button
          onClick={() => mudarTela("bolao")}
          style={{
            border: "none",
            cursor: "pointer",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            transition: ".3s",
            background:
              telaAtual === "bolao"
                ? "linear-gradient(90deg,#0057b8,#bf0a30)"
                : "transparent",
            color:
              telaAtual === "bolao"
                ? "#fff"
                : "#333",
          }}
        >
          👥 Bolões
        </button>
      </div>
    </nav>
  );
}

export default Navbar;