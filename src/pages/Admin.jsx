import { useState, useEffect } from "react";
import jogos from "../data/jogos";

import { salvarResultado } from "../services/resultadosService";
import { calcularPontosUsuarios } from "../services/apostaService";

import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Admin({ voltar }) {
  const [resultados, setResultados] = useState({});

  useEffect(() => {
    carregarResultados();
  }, []);

  async function carregarResultados() {
    const snap = await getDocs(collection(db, "resultados"));

    const data = {};
    snap.forEach((d) => {
      data[d.id] = d.data();
    });

    setResultados(data);
  }

  async function salvar(jogo, gm, gv, classificado) {
    try {
      await salvarResultado(
        jogo.id,
        gm,
        gv,
        classificado
      );

      const pontos = await calcularPontosUsuarios();

      const users = await getDocs(collection(db, "usuarios"));

      for (const u of users.docs) {
        await updateDoc(doc(db, "usuarios", u.id), {
          pontos: pontos[u.id] || 0,
        });
      }

      await carregarResultados();

      alert("Resultado salvo e pontos atualizados!");
    } catch (erro) {
      console.error(erro);
      alert(erro.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* CABEÇALHO */}
      <div
        style={{
          background:
            "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
          color: "#fff",
          padding: "25px",
          borderRadius: "20px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,.15)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
            }}
          >
            ⚙️ Painel Administrativo
          </h1>

          <p
            style={{
              marginTop: "8px",
              opacity: 0.9,
            }}
          >
            Gerencie os resultados dos jogos e atualize a pontuação dos usuários.
          </p>
        </div>

        <button
          onClick={voltar}
          style={{
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            background: "#fff",
            color: "#0057b8",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🚪 Sair
        </button>
      </div>

      {/* ESTATÍSTICAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#0057b8",
            }}
          >
            Jogos
          </h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: "10px 0 0",
            }}
          >
            {jogos.length}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#006847",
            }}
          >
            Finalizados
          </h3>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: "10px 0 0",
            }}
          >
            {
              Object.values(resultados).filter(
                (r) => r?.finalizado
              ).length
            }
          </p>
        </div>
      </div>

      {/* LISTA DE JOGOS */}
      <div>
        {jogos.map((jogo) => (
          <JogoAdmin
            key={jogo.id}
            jogo={jogo}
            resultado={resultados[jogo.id]}
            onSalvar={salvar}
          />
        ))}
      </div>
    </div>
  );
}

function JogoAdmin({ jogo, resultado, onSalvar }) {
  const [gm, setGm] = useState(resultado?.golsMandante ?? "");
  const [gv, setGv] = useState(resultado?.golsVisitante ?? "");
  const [classificado, setClassificado] = useState(
    resultado?.classificado ?? ""
  );

  useEffect(() => {
    setGm(resultado?.golsMandante ?? "");
    setGv(resultado?.golsVisitante ?? "");
    setClassificado(resultado?.classificado ?? "");
  }, [resultado]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        marginBottom: 10,
      }}
    >
      <strong>
        {jogo.mandante} x {jogo.visitante}
      </strong>

      <br />
      <br />

      <input
        value={gm}
        onChange={(e) => setGm(e.target.value)}
      />

      <span> x </span>

      <input
        value={gv}
        onChange={(e) => setGv(e.target.value)}
      />

      {gm !== "" &&
        gv !== "" &&
        Number(gm) === Number(gv) &&
        jogo.fase !== "Grupos" && (
          <>
            <br />
            <br />

            <select
              value={classificado}
              onChange={(e) =>
                setClassificado(e.target.value)
              }
              style={{
                padding: "8px",
                borderRadius: "8px",
                width: "250px",
              }}
            >
              <option value="">
                Selecione quem classificou
              </option>

              <option value={jogo.mandante}>
                {jogo.mandante}
              </option>

              <option value={jogo.visitante}>
                {jogo.visitante}
              </option>
            </select>
          </>
        )}

      <br />
      <br />

      <button
        onClick={() =>
          onSalvar(
            jogo,
            Number(gm),
            Number(gv),
            classificado
          )
        }
      >
        Salvar
      </button>

      {resultado && (
        <>
          <p>
            Final: {resultado.golsMandante} x{" "}
            {resultado.golsVisitante}
          </p>

          {resultado.classificado && (
            <p>
              ✅ Classificado:{" "}
              <strong>{resultado.classificado}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;