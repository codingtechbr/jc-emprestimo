document.addEventListener("DOMContentLoaded", () => {
  const checkFirebase = setInterval(() => {
    if (window.db) {
      clearInterval(checkFirebase);
      initApp();
    }
  }, 100);

  function initApp() {
    const form = document.getElementById("fgts-form");
    const tabela = document.getElementById("tabela-fgts");
    const mostrarFormBtn = document.getElementById("mostrar-form");
    const exportarBtn = document.getElementById("exportar-excel");

    // Controle do formulário
    if (mostrarFormBtn && form) {
      mostrarFormBtn.addEventListener("click", () => {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        mostrarFormBtn.innerHTML = form.style.display === 'block' ? '✖ Cancelar' : '💼 Cadastrar FGTS';
      });
    }

    // Submissão do formulário
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
          nome: document.getElementById("nome").value,
          cpf: document.getElementById("cpf").value,
          dataOperacao: document.getElementById("dataOperacao").value,
          banco: document.getElementById("banco").value,
          promotor: document.getElementById("promotor").value,
          vendedor: document.getElementById("vendedor").value,
          valorContrato: parseFloat(document.getElementById("valorContrato").value),
          comissao: parseFloat(document.getElementById("comissao").value),
          status: document.getElementById("status").value,
          timestamp: new Date()
        };

        try {
          await db.collection("fgts").add(data);
          alert("Cadastro realizado!");
          form.reset();
          carregarDados();
        } catch (error) {
          alert("Erro ao cadastrar: " + error.message);
        }
      });
    }

    // Carregar e ordenar dados
    async function carregarDados() {
      const snapshot = await db.collection("fgts").orderBy("timestamp", "desc").get();
      tabela.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        tabela.innerHTML += `
          <tr>
            <td>${d.nome}</td>
            <td>${d.cpf}</td>
            <td>${d.dataOperacao}</td>
            <td>${d.banco}</td>
            <td>${d.promotor}</td>
            <td>${d.vendedor}</td>
            <td>R$ ${d.valorContrato.toFixed(2)}</td>
            <td>R$ ${d.comissao.toFixed(2)}</td>
            <td>${d.status}</td>
          </tr>
        `;
      });
      configurarOrdenacao(); // Ativa a ordenação
    }

    // Ordenação por coluna
    function configurarOrdenacao() {
      document.querySelectorAll("thead th").forEach(th => {
        th.style.cursor = "pointer";
        th.addEventListener("click", async () => {
          const coluna = th.getAttribute("data-coluna");
          const snapshot = await db.collection("fgts").orderBy(coluna).get();
          tabela.innerHTML = "";
          snapshot.forEach(doc => {
            const d = doc.data();
            tabela.innerHTML += `
              <tr>
                <td>${d.nome}</td>
                <td>${d.cpf}</td>
                <td>${d.dataOperacao}</td>
                <td>${d.banco}</td>
                <td>${d.promotor}</td>
                <td>${d.vendedor}</td>
                <td>R$ ${d.valorContrato.toFixed(2)}</td>
                <td>R$ ${d.comissao.toFixed(2)}</td>
                <td>${d.status}</td>
              </tr>
            `;
          });
        });
      });
    }

    // Exportar para Excel
    if (exportarBtn) {
      exportarBtn.addEventListener("click", async () => {
        try {
          const snapshot = await db.collection("fgts").get();
          const dados = snapshot.docs.map(doc => doc.data());
          const ws = XLSX.utils.json_to_sheet(dados);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "FGTS");
          XLSX.writeFile(wb, "fgts.xlsx");
        } catch (error) {
          alert("Erro ao exportar: " + error.message);
        }
      });
    }

    carregarDados();
  }
});