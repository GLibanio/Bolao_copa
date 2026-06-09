export function gerarClassificacao(
    jogos,
    resultados
  ) {
    const grupos = {};
  
    jogos.forEach((jogo) => {
      if (!grupos[jogo.grupo]) {
        grupos[jogo.grupo] = {};
      }
  
      if (!grupos[jogo.grupo][jogo.mandante]) {
        grupos[jogo.grupo][jogo.mandante] = {
          nome: jogo.mandante,
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          golsFeitos: 0,
          golsSofridos: 0,
        };
      }
  
      if (!grupos[jogo.grupo][jogo.visitante]) {
        grupos[jogo.grupo][jogo.visitante] = {
          nome: jogo.visitante,
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          golsFeitos: 0,
          golsSofridos: 0,
        };
      }
  
      const resultado = resultados[jogo.id];
  
      if (!resultado?.finalizado) return;
  
      const mandante =
        grupos[jogo.grupo][jogo.mandante];
  
      const visitante =
        grupos[jogo.grupo][jogo.visitante];
  
      mandante.jogos++;
      visitante.jogos++;
  
      mandante.golsFeitos +=
        resultado.golsMandante;
  
      mandante.golsSofridos +=
        resultado.golsVisitante;
  
      visitante.golsFeitos +=
        resultado.golsVisitante;
  
      visitante.golsSofridos +=
        resultado.golsMandante;
  
      if (
        resultado.golsMandante >
        resultado.golsVisitante
      ) {
        mandante.vitorias++;
        visitante.derrotas++;
  
        mandante.pontos += 3;
      } else if (
        resultado.golsMandante <
        resultado.golsVisitante
      ) {
        visitante.vitorias++;
        mandante.derrotas++;
  
        visitante.pontos += 3;
      } else {
        mandante.empates++;
        visitante.empates++;
  
        mandante.pontos += 1;
        visitante.pontos += 1;
      }
    });
  
    Object.keys(grupos).forEach((grupo) => {
      grupos[grupo] = Object.values(
        grupos[grupo]
      ).sort((a, b) => {
        if (b.pontos !== a.pontos)
          return b.pontos - a.pontos;
  
        const saldoA =
          a.golsFeitos - a.golsSofridos;
  
        const saldoB =
          b.golsFeitos - b.golsSofridos;
  
        if (saldoB !== saldoA)
          return saldoB - saldoA;
  
        return (
          b.golsFeitos - a.golsFeitos
        );
      });
    });
  
    return grupos;
  }