import { useState, useEffect } from "react";
import {
  criarBolao,
  entrarBolao,
  buscarBolaoUsuario,
  sairBolao,
} from "../services/bolaoService";

import jogos from "../data/jogos";

import { useAuth } from "../hooks/useAuth";

import { doc, onSnapshot, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

function Bolao() {
  const { usuario } = useAuth();

  const [nomeBolao, setNomeBolao] = useState("");
  const [codigoBolao, setCodigoBolao] = useState("");

  const [boloes, setBoloes] = useState([]);
  const [bolaoSelecionado, setBolaoSelecionado] = useState(null);

  const [ranking, setRanking] = useState([]);
  const [palpites, setPalpites] = useState([]);

  const [descricaoBolao, setDescricaoBolao] = useState("");
  const [valorAposta, setValorAposta] = useState("");

  async function carregarPalpitesBolao(participantes = []) {
    try {
      const resultadosSnap = await getDocs(
        collection(db, "resultados")
      );

      const resultados = {};

      resultadosSnap.forEach((docSnap) => {
        resultados[Number(docSnap.id)] =
          docSnap.data();
      });

      // procura o primeiro jogo NÃO finalizado
      const proximoJogo = jogos
        .sort((a, b) => a.id - b.id)
        .find((jogo) => {
          const resultado =
            resultados[jogo.id];

          return !resultado?.finalizado;
        });

      console.log(
        "Próximo jogo encontrado:",
        proximoJogo
      );

      if (!proximoJogo) {
        setPalpites([]);
        return;
      }

      const apostasSnap = await getDocs(
        collection(db, "apostas")
      );

      const lista = participantes.map(
        (participante) => {
          const apostaDoc =
            apostasSnap.docs.find((docSnap) => {
              const aposta = docSnap.data();

              return (
                aposta.usuarioId ===
                participante.id &&
                Number(aposta.jogoId) ===
                Number(proximoJogo.id)
              );
            });

          return {
            nome: participante.nome,
            jogo:
              `${proximoJogo.mandante} x ${proximoJogo.visitante}`,
            palpite: apostaDoc
              ? `${apostaDoc.data().golsMandante} x ${apostaDoc.data().golsVisitante}`
              : "Sem palpite",
          };
        }
      );

      console.log(
        "Palpites carregados:",
        lista
      );

      setPalpites(lista);
    } catch (erro) {
      console.error(
        "Erro ao carregar palpites:",
        erro
      );
    }
  }

  // =========================
  // LISTENER DO BOLÃO
  // =========================
  useEffect(() => {
    if (!usuario) return;

    let unsub;

    async function init() {
      const lista = await buscarBolaoUsuario(
        usuario.id
      );

      setBoloes(lista);

      const userRef = doc(
        db,
        "usuarios",
        usuario.id
      );

      unsub = onSnapshot(userRef, async () => {
        const atualizados =
          await buscarBolaoUsuario(usuario.id);

        setBoloes(atualizados);


      });
    }

    init();

    return () => {
      if (unsub) unsub();
    };
  }, [usuario]);

  // =========================
  // RANKING (USUÁRIO REAL)
  // =========================
  async function carregarRanking(participantes = []) {
    try {
      const lista = await Promise.all(
        participantes.map(async (p) => {
          const snap = await getDoc(doc(db, "usuarios", p.id));

          const data = snap.exists() ? snap.data() : {};

          return {
            id: p.id,
            nome: p.nome,
            pontos: data.pontos || 0,
          };
        })
      );

      lista.sort((a, b) => b.pontos - a.pontos);

      setRanking(lista);
    } catch (err) {
      console.error("Erro ranking:", err);
    }
  }

  // =========================
  // AÇÕES
  // =========================

  const [unsubGrupo, setUnsubGrupo] =
    useState(null);

  function abrirBolao(bolao) {
    setBolaoSelecionado(bolao);

    const unsub = onSnapshot(
      doc(db, "boloes", bolao.codigo),
      async (snap) => {
        if (!snap.exists()) return;

        const data = snap.data();

        setBolaoSelecionado(data);

        await carregarRanking(
          data.participantes || []
        );

        await carregarPalpitesBolao(
          data.participantes || []
        );
      }
    );

    return unsub;
  }

  async function handleCriarBolao() {
    try {
      const codigo = await criarBolao(
        {
          nome: nomeBolao,
          descricao: descricaoBolao,
          valorAposta: Number(valorAposta) || 0,
        },
        usuario
      );

      alert(`Código: ${codigo}`);

      setNomeBolao("");
      setDescricaoBolao("");
      setValorAposta("");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleEntrarBolao() {
    try {
      await entrarBolao(
        codigoBolao.toUpperCase(),
        usuario
      );

      alert("Entrou no bolão com sucesso!");

      setCodigoBolao("");
    } catch (error) {
      alert(
        error.message ||
        "Erro ao entrar no bolão"
      );
    }
  }

  async function handleSairBolao() {
    await sairBolao(
      bolaoSelecionado.codigo,
      usuario.id
    );

    setBolaoSelecionado(null);

    const lista =
      await buscarBolaoUsuario(usuario.id);

    setBoloes(lista);
  }

  // =========================
  // LOGADO
  // =========================
  if (bolaoSelecionado) {
    return (
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#006847,#0057b8,#bf0a30)",
            color: "#fff",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,.15)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
            }}
          >
            {bolaoSelecionado.nome}
          </h1>

          <p
            style={{
              marginTop: "12px",
              opacity: 0.9,
              maxWidth: "700px",
            }}
          >
            {bolaoSelecionado.descricao ||
              "Bolão da Copa do Mundo 2026"}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                background:
                  "rgba(255,255,255,.15)",
                padding: "10px 15px",
                borderRadius: "12px",
              }}
            >
              🔑 {bolaoSelecionado.codigo}
            </div>

            <div
              style={{
                background:
                  "rgba(255,255,255,.15)",
                padding: "10px 15px",
                borderRadius: "12px",
              }}
            >
              👥{" "}
              {bolaoSelecionado.participantes
                ?.length || 0}
            </div>

            <div
              style={{
                background:
                  "rgba(255,255,255,.15)",
                padding: "10px 15px",
                borderRadius: "12px",
              }}
            >
              R$
              {bolaoSelecionado.valorAposta || 0}
            </div>
          </div>
        </div>

        {/* AÇÕES */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => {
              if (unsubGrupo) {
                unsubGrupo();
              }

              setBolaoSelecionado(null);
              setRanking([]);
              setPalpites([]);
            }}
            style={{
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              background: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            ← Voltar
          </button>

          <button
            onClick={handleSairBolao}
            style={{
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              background: "#bf0a30",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Sair do Bolão
          </button>
        </div>

        {/* CONTEÚDO */}
        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
            width: "100%",
          }}
        >
          {/* RANKING */}
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.08)",
              overflowX: "auto",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "#0057b8",
              }}
            >
              Ranking
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f5f7fa",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    Pos
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                    }}
                  >
                    Participante
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    Pontos
                  </th>
                </tr>
              </thead>

              <tbody>
                {ranking.map((p, index) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `${index + 1}º`}
                    </td>

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      {p.nome}
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#006847",
                      }}
                    >
                      {p.pontos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRÓXIMO JOGO */}
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "#006847",
              }}
            >
              Próximo Jogo
            </h2>

            <div
              style={{
                background:
                  "linear-gradient(135deg,#006847,#0057b8)",
                color: "#fff",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
                wordBreak: "break-word",
              }}
            >
              {palpites[0]?.jogo ||
                "Nenhum jogo encontrado"}
            </div>

            {palpites.length === 0 ? (
              <p>Nenhum palpite encontrado.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {palpites.map((p, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#fafafa",
                      border:
                        "1px solid #ececec",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {p.nome}
                    </span>

                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          p.palpite ===
                            "Sem palpite"
                            ? "#bf0a30"
                            : "#006847",
                      }}
                    >
                      {p.palpite}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // INÍCIO
  // =========================
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
      }}
    >      <div
      style={{
        background:
          "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
        color: "#fff",
        padding: "clamp(18px, 4vw, 30px)",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,.15)",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
            fontWeight: "700",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          Meus Bolões
        </h1>

        <p
          style={{
            marginTop: "12px",
            marginBottom: 0,
            opacity: 0.95,
            fontSize: "clamp(.9rem, 2vw, 1.1rem)",
            lineHeight: 1.6,
            maxWidth: "800px",
          }}
        >
          Crie grupos, acompanhe rankings e dispute a Copa do Mundo
          2026, valendo dinheiro ou apenas por diversão.
          <br />
          3 pontos por placar exato
          <br />
          1 ponto por acertar vencedor ou empate com gols diferentes
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: ".9rem",
            }}
          >
            Copa 2026
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: ".9rem",
            }}
          >
            Rankings
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: ".9rem",
            }}
          >
            Grupos
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: ".9rem",
            }}
          >
            Premiações
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "clamp(18px, 3vw, 25px)",
            flex: "1 1 450px",
            minWidth: "280px",
            boxShadow: "0 6px 20px rgba(0,0,0,.08)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#0057b8",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            }}
          >
            Criar Bolão
          </h2>

          <input
            placeholder="Nome do bolão"
            value={nomeBolao}
            onChange={(e) => setNomeBolao(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <br />
          <br />

          <textarea
            placeholder="Descrição do bolão"
            value={descricaoBolao}
            onChange={(e) => setDescricaoBolao(e.target.value)}
            style={{
              width: "100%",
              minHeight: "90px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />

          <br />
          <br />

          <input
            type="number"
            placeholder="Valor da aposta (R$)"
            value={valorAposta}
            onChange={(e) => setValorAposta(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <br />
          <br />

          <button
            onClick={handleCriarBolao}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(90deg,#006847,#0057b8)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              transition: ".2s",
            }}
          >
            Criar Bolão
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "25px",
            flex: "1 1 350px",
            minWidth: "280px",
            boxSizing: "border-box",
            boxShadow: "0 6px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#0057b8",
            }}
          >
            Entrar em um Bolão
          </h2>

          <input
            value={codigoBolao}
            onChange={(e) =>
              setCodigoBolao(e.target.value)
            }
            placeholder="Digite o código"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "15px",
              marginBottom: "20px",
            }}
          />

          <button
            disabled={boloes.length >= 3}
            onClick={handleEntrarBolao}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(90deg,#0057b8,#bf0a30)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              transition: ".3s",
            }}
          >
            Entrar no Bolão
          </button>
        </div>
      </div>

      <h2
        style={{
          color: "#0057b8",
          marginBottom: "20px",
          fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
          textAlign: "center",
        }}
      >
        Seus Grupos
      </h2>

      {boloes.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "18px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h3>Nenhum bolão encontrado</h3>

          <p
            style={{
              color: "#666",
            }}
          >
            Crie um bolão ou entre utilizando um código.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            width: "100%",
          }}
        >
          {boloes.map((bolao) => (
            <div
              key={bolao.codigo}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "20px",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,.08)",
                borderTop:
                  "5px solid #0057b8",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              <div>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                    color: "#0057b8",
                    wordBreak: "break-word",
                  }}
                >
                  {bolao.nome}
                </h3>

                <p
                  style={{
                    color: "#666",
                    marginBottom: "18px",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                >
                  {bolao.descricao ||
                    "Sem descrição"}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontSize: "14px",
                    }}
                  >
                    💰{" "}
                    {bolao.valorAposta > 0
                      ? `R$ ${bolao.valorAposta}`
                      : "Sem aposta"}
                  </div>

                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontSize: "14px",
                    }}
                  >
                    👥{" "}
                    {bolao.participantes?.length ||
                      0}
                  </div>
                </div>

                <div
                  style={{
                    background: "#eef4ff",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      color: "#0057b8",
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    CÓDIGO DO BOLÃO
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(15px, 3vw, 18px)",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      wordBreak: "break-all",
                    }}
                  >
                    {bolao.codigo}
                  </div>
                </div>
              </div>

              <button
                onClick={() => abrirBolao(bolao)}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "15px",
                  background:
                    "linear-gradient(90deg,#006847,#0057b8)",
                }}
              >
                Abrir Grupo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bolao;