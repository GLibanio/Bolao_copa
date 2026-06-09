import { useState } from "react";

function ModalAposta({
  jogo,
  apostaAtual,
  onSalvar,
  onFechar,
}) {
  const [mandante, setMandante] = useState(
    apostaAtual?.golsMandante ?? ""
  );

  const [visitante, setVisitante] = useState(
    apostaAtual?.golsVisitante ?? ""
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxSizing: "border-box",
          boxShadow:
            "0 15px 40px rgba(0,0,0,.25)",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            background:
              "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
            color: "#fff",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.2rem,4vw,1.6rem)",
            }}
          >
            Fazer Palpite
          </h2>

          <p
            style={{
              marginTop: "8px",
              opacity: 0.9,
              fontSize: "14px",
            }}
          >
            Copa do Mundo 2026
          </p>
        </div>

        {/* Conteúdo */}
        <div
          style={{
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#333",
                fontSize: "clamp(1rem,4vw,1.3rem)",
                wordBreak: "break-word",
              }}
            >
              {jogo.mandante}
            </h3>

            <div
              style={{
                margin: "10px 0",
                fontWeight: "bold",
                color: "#777",
              }}
            >
              VS
            </div>

            <h3
              style={{
                margin: 0,
                color: "#333",
                fontSize: "clamp(1rem,4vw,1.3rem)",
                wordBreak: "break-word",
              }}
            >
              {jogo.visitante}
            </h3>
          </div>

          {/* Placar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              flexWrap: "nowrap",
              marginBottom: "25px",
            }}
          >
            <input
              type="number"
              min="0"
              value={mandante}
              onChange={(e) =>
                setMandante(e.target.value)
              }
              style={{
                width: "70px",
                height: "55px",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
                borderRadius: "12px",
                border: "2px solid #ddd",
                boxSizing: "border-box",
              }}
            />

            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#555",
                flexShrink: 0,
              }}
            >
              x
            </span>

            <input
              type="number"
              min="0"
              value={visitante}
              onChange={(e) =>
                setVisitante(e.target.value)
              }
              style={{
                width: "70px",
                height: "55px",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
                borderRadius: "12px",
                border: "2px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Botões */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            <button
              onClick={onFechar}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: "#eee",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={() =>
                onSalvar(
                  Number(mandante),
                  Number(visitante)
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(90deg,#006847,#0057b8)",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Salvar Palpite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAposta;