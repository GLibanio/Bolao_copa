import { useState, useEffect } from "react";
import jogos from "../data/jogos";
import ModalAposta from "../components/ModalAposta";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { bandeiras } from "../data/bandeiras";
import { useAuth } from "../hooks/useAuth";
import { salvarAposta } from "../services/apostaService";



function MataMata() {

    const { usuario } = useAuth();

    const [apostas, setApostas] = useState({});

    const [resultados, setResultados] = useState({});

    const [mostrarModal, setMostrarModal] =
        useState(false);

    const [jogoSelecionado, setJogoSelecionado] =
        useState(null);

    useEffect(() => {
        carregarResultados();
    }, []);

    useEffect(() => {
        carregarResultados();
        carregarApostas();
    }, []);

    async function carregarApostas() {
        if (!usuario) return;

        const snap = await getDocs(collection(db, "apostas"));

        const data = {};

        snap.forEach((doc) => {
            const aposta = doc.data();

            if (aposta.usuarioId === usuario.id) {
                data[aposta.jogoId] = aposta;
            }
        });

        setApostas(data);
    }

    async function carregarResultados() {
        const snap = await getDocs(
            collection(db, "resultados")
        );

        const data = {};

        snap.forEach((doc) => {
            data[doc.id] = doc.data();
        });

        setResultados(data);
    }

    function abrirAposta(jogo) {
        setJogoSelecionado(jogo);
        setMostrarModal(true);
    }

    async function salvarPalpite(gm, gv, classificado) {
        try {
            await salvarAposta(
                usuario.id,
                jogoSelecionado.id,
                gm,
                gv,
                classificado
            );

            await carregarApostas();

            setMostrarModal(false);

            alert("Palpite salvo!");
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar palpite.");
        }
    }

    function getBandeira(nome) {
        return bandeiras[nome];
    }

    const fases = [
        {
            nome: "16 Avos",
            chave: "16 Avos",
            tituloJogo: "Segunda Fase",
        },
        {
            nome: "Oitavas",
            chave: "Oitavas",
            tituloJogo: "Oitavas",
        },
        {
            nome: "Quartas",
            chave: "Quartas",
            tituloJogo: "Quartas",
        },
        {
            nome: "Semifinais",
            chave: "Semifinal",
            tituloJogo: "Semi",
        },
        {
            nome: "3º Lugar",
            chave: "Terceiro Lugar",
            tituloJogo: "Disputa",
        },
        {
            nome: "Final",
            chave: "Final",
            tituloJogo: "Final",
        },
    ];

    const [faseAtual, setFaseAtual] = useState(0);

    const fase = fases[faseAtual];

    const jogosFase = jogos.filter(
        (j) => j.fase === fase.chave
    );

    function anterior() {
        if (faseAtual > 0) {
            setFaseAtual(faseAtual - 1);
        }
    }

    function proximo() {
        if (faseAtual < fases.length - 1) {
            setFaseAtual(faseAtual + 1);
        }
    }

    function jogoEmAndamento(jogo) {
        const dataHoraJogo = new Date(
            `${jogo.data}T${jogo.horario}:00`
        );

        return new Date() >= dataHoraJogo;
    }

    return (
        <div>
            {/* Cabeçalho */}
            <div
                style={{
                    background:
                        "linear-gradient(90deg,#006847,#0057b8,#bf0a30)",
                    color: "#fff",
                    padding: "25px",
                    borderRadius: "20px",
                    marginBottom: "25px",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    Mata-Mata
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    Caminho até a Final da Copa do Mundo 2026
                </p>
            </div>

            {/* Navegação */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                }}
            >
                <button
                    onClick={anterior}
                    disabled={faseAtual === 0}
                    style={botaoNav}
                >
                    ◀
                </button>

                <div
                    style={{
                        background: "#fff",
                        padding: "12px 25px",
                        borderRadius: "14px",
                        fontWeight: "bold",
                        fontSize: "18px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,.08)",
                    }}
                >
                    {fase.nome}
                </div>

                <button
                    onClick={proximo}
                    disabled={
                        faseAtual === fases.length - 1
                    }
                    style={botaoNav}
                >
                    ▶
                </button>
            </div>

            {/* Jogos */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(320px,1fr))",
                    gap: "20px",
                }}
            >
                {jogosFase.map((jogo, index) => {
                    const partidaIniciada =
                        jogo.data &&
                        jogo.horario &&
                        jogoEmAndamento(jogo);

                    const finalizado = resultados?.[jogo.id]?.finalizado;

                    const bloqueado = partidaIniciada || finalizado;

                    const aposta = apostas[jogo.id];

                    return (
                        <div
                            key={jogo.id}
                            style={{
                                background: "#fff",
                                borderRadius: "18px",
                                padding: "20px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,.08)",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "15px",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        color: "#0057b8",
                                    }}
                                >
                                    {fase.tituloJogo} {index + 1}
                                </h3>
                            </div>

                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#64748b",
                                    fontSize: "14px",
                                    marginBottom: "15px",
                                }}
                            >
                                {resultados?.[jogo.id]?.finalizado ? (
                                    <>
                                        {(() => {
                                            const resultado = resultados[jogo.id];
                                            const empate =
                                                resultado.golsMandante === resultado.golsVisitante;

                                            const classMandante =
                                                empate &&
                                                resultado.classificado === jogo.mandante;

                                            const classVisitante =
                                                empate &&
                                                resultado.classificado === jogo.visitante;

                                            return (
                                                <>
                                                    <div
                                                        style={{
                                                            fontSize: "26px",
                                                            fontWeight: "bold",
                                                            color: "#0057b8",
                                                        }}
                                                    >
                                                        {resultado.golsMandante}
                                                        {classMandante && " (C)"}
                                                        {" x "}
                                                        {resultado.golsVisitante}
                                                        {classVisitante && " (C)"}
                                                    </div>

                                                    <div
                                                        style={{
                                                            color: "#16a34a",
                                                            fontWeight: "bold",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        Encerrado
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: "6px",
                                                        }}
                                                    >
                                                        {jogo.local}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            {jogo.data
                                                ?.split("-")
                                                .reverse()
                                                .join("/")}
                                        </div>

                                        <div>{jogo.horario}</div>

                                        <div>{jogo.local}</div>
                                    </>
                                )}
                            </div>

                            <div
                                style={{
                                    background: "#f8fafc",
                                    borderRadius: "12px",
                                    padding: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "10px",
                                }}
                            >
                                {/* Mandante */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "40%",
                                        textAlign: "center",
                                    }}
                                >
                                    {getBandeira(jogo.mandante) && (
                                        <img
                                            src={getBandeira(jogo.mandante)}
                                            alt={jogo.mandante}
                                            style={{
                                                width: "60px",
                                                height: "40px",
                                                objectFit: "contain",
                                                marginBottom: "6px",
                                            }}
                                        />
                                    )}

                                    <strong
                                        style={{
                                            fontSize: "14px",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {jogo.mandante}
                                    </strong>
                                </div>

                                {/* Centro */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            color: "#0057b8",
                                            fontSize: "22px",
                                        }}
                                    >
                                        VS
                                    </div>
                                </div>

                                {/* Visitante */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "40%",
                                        textAlign: "center",
                                    }}
                                >
                                    {getBandeira(jogo.visitante) && (
                                        <img
                                            src={getBandeira(jogo.visitante)}
                                            alt={jogo.visitante}
                                            style={{
                                                width: "60px",
                                                height: "40px",
                                                objectFit: "contain",
                                                marginBottom: "6px",
                                            }}
                                        />
                                    )}

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

                            <div
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                {aposta ? (
                                    <div
                                        style={{
                                            background: "#eff6ff",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            marginTop: "15px",
                                            marginBottom: "12px",
                                            textAlign: "center",
                                            fontWeight: "600",
                                            color: "#1e3a8a",
                                        }}
                                    >
                                        Seu palpite:
                                        <strong>
                                            {" "}

                                            {aposta.golsMandante === aposta.golsVisitante &&
                                                aposta.classificado === jogo.mandante &&
                                                " (C)"}
                                            {aposta.golsMandante}
                                            {" x "}
                                            {aposta.golsVisitante}
                                            {aposta.golsMandante === aposta.golsVisitante &&
                                                aposta.classificado === jogo.visitante &&
                                                " (C)"}
                                            
                                        </strong>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            background: "#f8fafc",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            marginTop: "15px",
                                            marginBottom: "12px",
                                            textAlign: "center",
                                            color: "#64748b",
                                        }}
                                    >
                                        Nenhum palpite
                                    </div>
                                )}
                                <button
                                    disabled={partidaIniciada || finalizado}
                                    onClick={() => abrirAposta(jogo)}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        border: "none",
                                        borderRadius: "12px",
                                        background:
                                            partidaIniciada || finalizado
                                                ? "#94a3b8"
                                                : "linear-gradient(90deg,#006847,#0057b8)",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor:
                                            partidaIniciada || finalizado
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize: "15px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,.15)",
                                        opacity: partidaIniciada || finalizado ? 0.75 : 1,
                                    }}
                                >
                                    {finalizado
                                        ? "Encerrado"
                                        : partidaIniciada
                                            ? "Partida em andamento"
                                            : aposta
                                                ? "Editar Palpite"
                                                : "Fazer Palpite"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {mostrarModal && jogoSelecionado && (
                <ModalAposta
                    jogo={jogoSelecionado}
                    apostaAtual={apostas[jogoSelecionado.id]}
                    onSalvar={salvarPalpite}
                    onFechar={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
}

const botaoNav = {
    border: "none",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#0057b8",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
};

export default MataMata;