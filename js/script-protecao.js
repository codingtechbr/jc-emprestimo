document.addEventListener("DOMContentLoaded", () => {
  const checkFirebase = setInterval(() => {
    if (window.db) {
      clearInterval(checkFirebase);
      initApp();
    }
  }, 100);

  function initApp() {
    const form = document.getElementById("protecao-form");
    const tabela = document.getElementById("tabela-protecao");
    const mostrarFormBtn = document.getElementById("mostrar-form");
    const exportarBtn = document.getElementById("exportar-excel");

    if (mostrarFormBtn && form) {
      mostrarFormBtn.addEventListener("click", () => {
        if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'block';
          mostrarFormBtn.innerHTML = '✖ Cancelar';
        } else {
          form.style.display = 'none';
          mostrarFormBtn.innerHTML = '🚗 Cadastrar Veículo';
        }
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
          nome: document.getElementById("nome").value,
          cpf: document.getElementById("cpf").value,
          placa: document.getElementById("placa").value,
          modelo: document.getElementById("modelo").value,
          telefone: document.getElementById("telefone").value,
          status: document.getElementById("status").value,
          timestamp: new Date()
        };

        try {
          await db.collection("protecao").add(data);
          alert("Cadastro realizado!");
          form.reset();
          carregarDados();
        } catch (error) {
          alert("Erro ao cadastrar: " + error.message);
        }
      });

      async function carregarDados() {
        tabela.innerHTML = "";
        const snapshot = await db.collection("protecao").orderBy("timestamp", "desc").get();
        snapshot.forEach(doc => {
          const d = doc.data();
          tabela.innerHTML += `
            <tr>
              <td>${d.nome}</td>
              <td>${d.cpf}</td>
              <td>${d.placa}</td>
              <td>${d.modelo}</td>
              <td>${d.telefone}</td>
              <td>${d.status}</td>
            </tr>
          `;
        });
      }

      carregarDados();
    }

    if (exportarBtn) {
      exportarBtn.addEventListener("click", () => {
        alert("Exportação ainda não implementada");
      });
    }
  }
});
// Adicione esta função após a função carregarDados()
function configurarOrdenacao() {
  const ths = document.querySelectorAll("thead th");
  ths.forEach(th => {
    th.addEventListener("click", () => {
      const coluna = th.getAttribute("data-coluna");
      if (coluna) ordenarTabela(coluna);
    });
  });
}

async function ordenarTabela(coluna) {
  const snapshot = await db.collection("protecao").orderBy(coluna).get();
  const tabela = document.getElementById("tabela-protecao");
  tabela.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    tabela.innerHTML += `
      <tr>
        <td>${d.nome}</td>
        <td>${d.cpf}</td>
        <td>${d.placa}</td>
        <td>${d.modelo}</td>
        <td>${d.telefone}</td>
        <td>${d.status}</td>
      </tr>
    `;
  });
}
if (exportarBtn) {
  exportarBtn.addEventListener("click", async () => {
    try {
      const snapshot = await db.collection("protecao").get();
      const dados = [];
      snapshot.forEach(doc => {
        dados.push(doc.data());
      });

      const ws = XLSX.utils.json_to_sheet(dados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ProtecaoVeicular");
      XLSX.writeFile(wb, "protecao_veicular.xlsx");
    } catch (error) {
      alert("Erro ao exportar: " + error.message);
    }
  });
}
// Modifique o HTML (protecao.html) para adicionar data-coluna nos cabeçalhos:
// <th data-coluna="nome">Nome</th>
// <th data-coluna="cpf">CPF</th>
// ... (repita para outras colunas)