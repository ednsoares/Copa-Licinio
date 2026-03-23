const KEY = "jogosRodadas";

// ===== TIMES =====
const grupoA = ["TEC","Jurema","Duas Passagens","Top Car","Max Móveis"];
const grupoB = ["WG","Cantinho da Gê","Supermercado Mattus","Supermercado Pacheco","Inter FC"];

// ===== RODADAS =====
const rodadasBase = [
    {
        nome: "1ª Rodada",
        jogos: [
            { grupo:"A", t1:"Duas Passagens", t2:"Jurema" },
            { grupo:"B", t1:"WG", t2:"Cantinho da Gê" },
            { grupo:"A", t1:"Max Móveis", t2:"Top Car" }
        ]
    },
    {
        nome: "2ª Rodada",
        jogos: [
            { grupo:"A", t1:"TEC", t2:"Duas Passagens" },
            { grupo:"A", t1:"Max Móveis", t2:"Jurema" },
            { grupo:"B", t1:"Inter FC", t2:"Cantinho da Gê" },
            { grupo:"B", t1:"Supermercado Pacheco", t2:"Supermercado Mattus" }
        ]
    },
    {
        nome: "Rodada Extra",
        jogos: [
            { grupo:"B", t1:"Inter FC", t2:"WG" }
        ]
    },
    {
        nome: "3ª Rodada",
        jogos: [
            { grupo:"B", t1:"Supermercado Pacheco", t2:"Inter FC" },
            { grupo:"B", t1:"Supermercado Mattus", t2:"WG" },
            { grupo:"A", t1:"TEC", t2:"Max Móveis" },
            { grupo:"A", t1:"Jurema", t2:"Top Car" }
           
        ]
    },
    {
        nome: "4ª Rodada",
        jogos: [
            { grupo:"B", t1:"Supermercado Mattus", t2:"Cantinho da Gê" },
            { grupo:"B", t1:"WG", t2:"Supermercado Pacheco" },
            { grupo:"A", t1:"Jurema", t2:"TEC" },
            { grupo:"A", t1:"Duas Passagens", t2:"Top Car" }
        ]
    },
    {
        nome: "5ª Rodada",
        jogos: [
            { grupo:"B", t1:"Inter FC", t2:"Supermercado Mattus" },
            { grupo:"B", t1:"Cantinho da Gê", t2:"Supermercado Pacheco" },
            { grupo:"A", t1:"Max Móveis", t2:"Duas Passagens" },
            { grupo:"A", t1:"Top Car", t2:"TEC" }
        ]
    }
];

// ===== STORAGE =====
let rodadas = JSON.parse(localStorage.getItem(KEY)) || rodadasBase;

function salvar() {
    localStorage.setItem(KEY, JSON.stringify(rodadas));
}

// ===== RENDER JOGOS =====
function renderRodadas() {
    const container = document.getElementById("rodadas");
    if (!container) return;

    container.innerHTML = "";

    rodadas.forEach((rodada, rIndex) => {
        let html = `<h3>${rodada.nome}</h3><table>
        <tr><th>Grupo</th><th>Time 1</th><th>Placar</th><th>Time 2</th></tr>`;

        rodada.jogos.forEach((j, jIndex) => {
            html += `
            <tr>
                <td>${j.grupo}</td>
                <td>${j.t1}</td>
                <td>
                    <input value="${j.g1 || ""}" onchange="update(${rIndex},${jIndex},'g1',this.value)">
                    x
                    <input value="${j.g2 || ""}" onchange="update(${rIndex},${jIndex},'g2',this.value)">
                </td>
                <td>${j.t2}</td>
            </tr>`;
        });

        html += "</table>";
        container.innerHTML += html;
    });
}

// ===== UPDATE =====
function update(r, j, campo, valor) {
    rodadas[r].jogos[j][campo] = valor;
    salvar();
}

// ===== CALCULAR =====
function calcular(grupo, letra) {
    let tabela = grupo.map(n => ({
        nome:n,J:0,V:0,E:0,D:0,GF:0,GC:0,PTS:0,SG:0
    }));

    rodadas.forEach(r => {
        r.jogos
        .filter(j => j.grupo === letra && j.g1 && j.g2)
        .forEach(j => {
            let t1 = tabela.find(t => t.nome === j.t1);
            let t2 = tabela.find(t => t.nome === j.t2);

            let g1 = parseInt(j.g1);
            let g2 = parseInt(j.g2);

            t1.J++; t2.J++;
            t1.GF += g1; t1.GC += g2;
            t2.GF += g2; t2.GC += g1;

            if (g1 > g2) { t1.V++; t2.D++; }
            else if (g2 > g1) { t2.V++; t1.D++; }
            else { t1.E++; t2.E++; }
        });
    });

    tabela.forEach(t => {
        t.PTS = t.V*3 + t.E;
        t.SG = t.GF - t.GC;
    });

    return tabela.sort((a,b)=>
        b.PTS - a.PTS || b.SG - a.SG || b.GF - a.GF
    );
}

// ===== RENDER TABELA =====
function renderTabela(dados, id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = `
    <tr>
        <th>Time</th><th>PTS</th><th>J</th><th>V</th><th>D</th><th>E</th><th>GF</th><th>GC</th><th>SG</th>
    </tr>`;

    dados.forEach((t,i)=>{
        el.innerHTML += `
        <tr class="${i<2 ? 'classificado':''}">
            <td>${t.nome}</td>
            <td>${t.PTS}</td>
            <td>${t.J}</td>
            <td>${t.V}</td>
            <td>${t.D}</td>
            <td>${t.E}</td>
            <td>${t.GF}</td>
            <td>${t.GC}</td>
            <td>${t.SG}</td>
        </tr>`;
    });
}

// ===== ATUALIZAR =====
function atualizarTabela() {
    renderTabela(calcular(grupoA,"A"), "tabelaA");
    renderTabela(calcular(grupoB,"B"), "tabelaB");
}

// ===== RESET =====
function resetar() {
    localStorage.clear();
    location.reload();
}