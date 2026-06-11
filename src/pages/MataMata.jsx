import { useState } from "react";
import jogos from "../data/jogos";
import ModalAposta from "../components/ModalAposta";

function MataMata() {
    const [mostrarModal, setMostrarModal] =
        useState(false);

    const [jogoSelecionado, setJogoSelecionado] =
        useState(null);

    function abrirAposta(jogo) {
        setJogoSelecionado(jogo);
        setMostrarModal(true);
    }

    function salvarPalpite(gm, gv) {
        console.log(
            "Palpite:",
            jogoSelecionado.id,
            gm,
            gv
        );

        alert(
            `Palpite salvo: ${gm} x ${gv}`
        );

        setMostrarModal(false);
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
                {jogosFase.map((jogo, index) => (
                    <div
                        key={jogo.id}
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "20px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,.08)",
                            border:
                                "1px solid #e5e7eb",
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
                            <div>{jogo.data}</div>
                            <div>{jogo.horario}</div>
                            <div>{jogo.local}</div>
                        </div>

                        <div
                            style={{
                                background: "#f8fafc",
                                borderRadius: "12px",
                                padding: "15px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                {jogo.mandante}
                            </div>

                            <div
                                style={{
                                    margin: "15px 0",
                                    fontWeight: "bold",
                                    color: "#0057b8",
                                    fontSize: "22px",
                                }}
                            >
                                VS
                            </div>

                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                {jogo.visitante}
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: "15px",
                            }}
                        >
                            <button
                                hidden
                                onClick={() => abrirAposta(jogo)}
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
                                    fontSize: "15px",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,.15)",
                                }}
                            >
                                Fazer Palpite
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {mostrarModal && jogoSelecionado && (
                <ModalAposta
                    jogo={jogoSelecionado}
                    apostaAtual={null}
                    onSalvar={salvarPalpite}
                    onFechar={() =>
                        setMostrarModal(false)
                    }
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