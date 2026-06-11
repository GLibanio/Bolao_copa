import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import jogos from "../data/jogos";
import ModalAposta from "../components/ModalAposta";


import {
    salvarAposta,
    buscarApostasUsuario,
} from "../services/apostaService";

import { buscarResultados } from "../services/resultadosService";
import { gerarClassificacao } from "../services/classificacaoService";
import { bandeiras } from "../data/bandeiras";

function Home() {
    const { usuario, logout } = useAuth();

    const [rodadasGrupo, setRodadasGrupo] = useState({
        A: 1, B: 1, C: 1, D: 1,
        E: 1, F: 1, G: 1, H: 1,
        I: 1, J: 1, K: 1, L: 1,
    });

    const [apostas, setApostas] = useState({});
    const [resultados, setResultados] = useState({});

    const [jogoSelecionado, setJogoSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const grupos = gerarClassificacao(jogos, resultados);

    const headerStyle = {
        padding: "14px",
        textAlign: "center",
        fontWeight: "bold",
    };

    const cellStyle = {
        padding: "12px",
        textAlign: "center",
    };


    function proximaRodada(grupo) {
        setRodadasGrupo((prev) => ({
            ...prev,
            [grupo]: Math.min(
                prev[grupo] + 1,
                3
            ),
        }));
    }

    function rodadaAnterior(grupo) {
        setRodadasGrupo((prev) => ({
            ...prev,
            [grupo]: Math.max(
                prev[grupo] - 1,
                1
            ),
        }));
    }

    useEffect(() => {
        if (usuario) carregarDados();
    }, [usuario]);

    async function carregarDados() {
        try {
            const [apostasUsuario, resultadosFirebase] = await Promise.all([
                buscarApostasUsuario(usuario.id),
                buscarResultados(),
            ]);

            setApostas(apostasUsuario || {});
            const map = {};

            (resultadosFirebase || []).forEach((r) => {
                map[r.id] = r;
            });

            setResultados(map);
        } catch (err) {
            console.error(err);
        }
    }

    function getBandeira(nome) {
        return bandeiras[nome];
    }

    function abrirAposta(jogo) {
        setJogoSelecionado(jogo);
        setMostrarModal(true);
    }

    async function salvarPalpite(golsMandante, golsVisitante) {
        await salvarAposta(
            usuario.id,
            jogoSelecionado.id,
            golsMandante,
            golsVisitante
        );

        setMostrarModal(false);

        await carregarDados();

        alert("Palpite salvo!");
    }

    function jogoEmAndamento(jogo) {
        const dataHoraJogo = new Date(
            `${jogo.data}T${jogo.horario}:00`
        );

        return new Date() >= dataHoraJogo;
    }

    return (
        <div
            style={{
                width: "100%",
                padding: "clamp(10px,2vw,20px)",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    background:
                        "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
                    borderRadius: "20px",
                    padding: "clamp(18px,4vw,35px)",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "30px",
                    boxShadow: "0 6px 20px rgba(0,0,0,.15)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        flex: "1 1 280px",
                        minWidth: 0,
                    }}
                >
                    <span
                        style={{
                            color: "rgba(255,255,255,.8)",
                            fontSize: "clamp(10px,2vw,13px)",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "5px",
                        }}
                    >
                        FIFA WORLD CUP 2026
                    </span>

                    <h1
                        style={{
                            margin: 0,
                            color: "#fff",
                            fontSize: "clamp(22px,5vw,36px)",
                            lineHeight: 1.15,
                            wordBreak: "break-word",
                        }}
                    >
                        Bolão Copa 2026
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            marginBottom: 0,
                            color: "rgba(255,255,255,.9)",
                            fontSize: "clamp(14px,2.5vw,17px)",
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                        }}
                    >
                        Bem-vindo,{" "}
                        <strong>
                            {usuario?.nome}
                        </strong>
                    </p>
                </div>

                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 18px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,.18)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,.25)",
                        boxShadow: "0 4px 15px rgba(0,0,0,.12)",
                        marginTop: "8px",
                    }}
                >


                    <div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "rgba(255,255,255,.8)",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                fontWeight: "600",
                            }}
                        >
                            Seus Pontos
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "800",
                                color: "#fff",
                                lineHeight: 1,
                                marginTop: "2px",
                            }}
                        >
                            {usuario?.pontos || 0}
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        flex: "1 1 160px",
                        minWidth: "140px",
                        maxWidth: "220px",
                        width: "100%",
                        background: "#fff",
                        color: "#bf0a30",
                        border: "none",
                        padding: "14px 20px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "15px",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,.15)",
                        transition: ".2s",
                    }}
                >
                    Sair
                </button>
            </div>


            {Object.entries(grupos)
                .sort()
                .map(([grupo, times]) => {
                    const rodadaAtual = rodadasGrupo[grupo];

                    const jogosGrupo = jogos.filter(
                        (j) => j.grupo === grupo && j.rodada === rodadaAtual
                    );

                    return (
                        <div
                            key={grupo}
                            style={{
                                marginBottom: "60px",
                                background: "#f8fafc",
                                padding: "clamp(12px,3vw,25px)",
                                borderRadius: "24px",
                                boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                                border: "1px solid #e2e8f0",
                                boxSizing: "border-box",
                                overflow: "hidden",
                            }}
                        >
                            {/* CABEÇALHO */}
                            <div
                                style={{
                                    background:
                                        "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
                                    color: "#fff",
                                    padding: "clamp(12px,3vw,20px)",
                                    borderRadius: "16px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,.15)",
                                }}
                            >
                                <div
                                    style={{
                                        minWidth: 0,
                                        flex: "1 1 200px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "clamp(10px,2vw,12px)",
                                            opacity: 0.8,
                                            textTransform: "uppercase",
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        Copa do Mundo 2026
                                    </span>

                                    <h2
                                        style={{
                                            margin: 0,
                                            marginTop: "4px",
                                            fontSize: "clamp(20px,4vw,28px)",
                                        }}
                                    >
                                        Grupo {grupo}
                                    </h2>
                                </div>

                                <div
                                    style={{
                                        background:
                                            "rgba(255,255,255,.15)",
                                        padding: "8px 14px",
                                        borderRadius: "10px",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Rodada {rodadaAtual}
                                </div>
                            </div>

                            {/* TABELA */}
                            <div
                                style={{
                                    width: "100%",
                                    overflowX: "auto",
                                    WebkitOverflowScrolling: "touch",
                                    borderRadius: "18px",
                                    background: "#fff",
                                    boxShadow:
                                        "0 8px 25px rgba(0,0,0,.08)",
                                    marginBottom: "25px",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        minWidth: "650px",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                background:
                                                    "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
                                                color: "#fff",
                                            }}
                                        >
                                            <th style={headerStyle}>Pos</th>
                                            <th style={headerStyle}>Seleção</th>
                                            <th style={headerStyle}>Pts</th>
                                            <th style={headerStyle}>J</th>
                                            <th style={headerStyle}>V</th>
                                            <th style={headerStyle}>E</th>
                                            <th style={headerStyle}>D</th>
                                            <th style={headerStyle}>GP</th>
                                            <th style={headerStyle}>GC</th>
                                            <th style={headerStyle}>SG</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {times.map((t, index) => (
                                            <tr
                                                key={t.nome}
                                                style={{
                                                    background:
                                                        index % 2 === 0
                                                            ? "#fff"
                                                            : "#f8fafc",
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding: "12px",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color:
                                                            index < 2
                                                                ? "#16a34a"
                                                                : "#64748b",
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "12px",
                                                        fontWeight: 600,
                                                        minWidth: "180px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <img
                                                            src={getBandeira(t.nome)}
                                                            alt={t.nome}
                                                            style={{
                                                                width: "34px",
                                                                height: "24px",
                                                                borderRadius: "4px",
                                                                objectFit: "cover",
                                                                flexShrink: 0,
                                                                boxShadow:
                                                                    "0 2px 6px rgba(0,0,0,.15)",
                                                            }}
                                                        />

                                                        {t.nome}
                                                    </div>
                                                </td>

                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        fontWeight: "bold",
                                                        color: "#0057b8",
                                                    }}
                                                >
                                                    {t.pontos}
                                                </td>

                                                <td style={cellStyle}>{t.jogos}</td>
                                                <td style={cellStyle}>{t.vitorias}</td>
                                                <td style={cellStyle}>{t.empates}</td>
                                                <td style={cellStyle}>{t.derrotas}</td>
                                                <td style={cellStyle}>{t.golsFeitos}</td>
                                                <td style={cellStyle}>{t.golsSofridos}</td>

                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        fontWeight: "bold",
                                                        color:
                                                            t.golsFeitos -
                                                                t.golsSofridos >
                                                                0
                                                                ? "#16a34a"
                                                                : t.golsFeitos -
                                                                    t.golsSofridos <
                                                                    0
                                                                    ? "#dc2626"
                                                                    : "#64748b",
                                                    }}
                                                >
                                                    {t.golsFeitos -
                                                        t.golsSofridos}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* JOGOS */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "20px",
                                    marginBottom: "25px",
                                }}
                            >
                                <button
                                    onClick={() => rodadaAnterior(grupo)}
                                    disabled={rodadaAtual === 1}
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "#0057b8",
                                        color: "#fff",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ◀
                                </button>

                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "12px 25px",
                                        borderRadius: "999px",
                                        fontWeight: "bold",
                                        color: "#0057b8",
                                        boxShadow: "0 2px 10px rgba(0,0,0,.1)",
                                    }}
                                >
                                    Rodada {rodadaAtual}
                                </div>

                                <button
                                    onClick={() => proximaRodada(grupo)}
                                    disabled={rodadaAtual === 3}
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "#0057b8",
                                        color: "#fff",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ▶
                                </button>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: "20px",
                                    marginTop: "20px",
                                    width: "100%",
                                }}
                            >
                                {jogosGrupo.map((jogo) => {
                                    const aposta = apostas[jogo.id];
                                    const finalizado =
                                        resultados[jogo.id]?.finalizado;
                                    const partidaIniciada = jogoEmAndamento(jogo);


                                    return (
                                        <div
                                            key={jogo.id}
                                            style={{
                                                background: "#fff",
                                                borderRadius: "16px",
                                                padding: "16px",
                                                width: "100%",
                                                boxSizing: "border-box",
                                                overflow: "hidden",
                                                boxShadow:
                                                    "0 4px 15px rgba(0,0,0,.08)",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    marginBottom: "15px",
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <img
                                                        src={getBandeira(jogo.mandante)}
                                                        alt={jogo.mandante}
                                                        style={{
                                                            width: "60px",
                                                            height: "40px",
                                                            objectFit: "contain",
                                                        }}
                                                    />

                                                    <strong
                                                        style={{
                                                            fontSize: "14px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        {jogo.mandante}
                                                    </strong>
                                                </div>

                                                <div
                                                    style={{
                                                        flexShrink: 0,
                                                        textAlign: "center",
                                                        padding: "0 5px",
                                                    }}
                                                >
                                                    <h2
                                                        style={{
                                                            margin: 0,
                                                            color: "#0057b8",
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        VS
                                                    </h2>

                                                    {jogo.data.split("-").reverse().join("/")}
                                                    <small
                                                        style={{
                                                            display: "block",
                                                            color: "#64748b",
                                                        }}
                                                    >
                                                        {jogo.horario}
                                                    </small>
                                                </div>

                                                <div
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <img
                                                        src={getBandeira(jogo.visitante)}
                                                        alt={jogo.visitante}
                                                        style={{
                                                            width: "60px",
                                                            height: "40px",
                                                            objectFit: "contain",
                                                        }}
                                                    />

                                                    <strong
                                                        style={{
                                                            fontSize: "14px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        {jogo.visitante}
                                                    </strong>
                                                </div>
                                            </div>

                                            {aposta ? (
                                                <div
                                                    style={{
                                                        background: "#eff6ff",
                                                        padding: "12px",
                                                        borderRadius: "10px",
                                                        marginBottom: "12px",
                                                        textAlign: "center",
                                                        width: "100%",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    Seu palpite:
                                                    <strong>
                                                        {" "}
                                                        {aposta.golsMandante} x{" "}
                                                        {aposta.golsVisitante}
                                                    </strong>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        background: "#f8fafc",
                                                        padding: "12px",
                                                        borderRadius: "10px",
                                                        marginBottom: "12px",
                                                        textAlign: "center",
                                                        color: "#64748b",
                                                        width: "100%",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    Nenhum palpite
                                                </div>
                                            )}

                                            <button
                                                disabled={finalizado || partidaIniciada}
                                                onClick={() => abrirAposta(jogo)}
                                                style={{
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                    padding: "14px",
                                                    border: "none",
                                                    borderRadius: "10px",
                                                    background:
                                                        finalizado
                                                            ? "#94a3b8"
                                                            : partidaIniciada
                                                                ? "#f59e0b"
                                                                : "#0057b8",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    cursor:
                                                        finalizado || partidaIniciada
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                            >
                                                {finalizado
                                                    ? "Encerrado"
                                                    : partidaIniciada
                                                        ? "Partida em andamento"
                                                        : aposta
                                                            ? "Editar Palpite"
                                                            : "Apostar"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            }

            {
                mostrarModal && jogoSelecionado && (
                    <ModalAposta
                        jogo={jogoSelecionado}
                        apostaAtual={apostas[jogoSelecionado.id]}
                        onSalvar={salvarPalpite}
                        onFechar={() => setMostrarModal(false)}
                    />
                )
            }
        </div >
    );
}

export default Home;