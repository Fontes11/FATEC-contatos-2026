import { getContatos, criarContato, atualizarContato, deletarContato } from "./contatos.js"

// ─── Tabela de contatos ───────────────────────────────────────────────────────

async function renderizarContatos({ botaoEditar = false, botaoDeletar = false } = {}) {
  const container = document.getElementById("lista-contatos")
  if (!container) return

  try {
    const contatos = await getContatos()

    if (contatos.length === 0) {
      container.innerHTML = `<p class="text-secondary">Nenhum contato cadastrado ainda.</p>`
      return
    }

    const colAcoes = botaoEditar || botaoDeletar ? `<th></th>` : ""

    container.innerHTML = `
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Endereço</th>
            <th>Cidade</th>
            ${colAcoes}
          </tr>
        </thead>
        <tbody>
          ${contatos.map(c => {
            let acoes = ""
            if (botaoEditar) {
              acoes += `
                <button class="btn btn-sm btn-warning btn-selecionar"
                  data-id="${c.id}" data-nome="${c.nome}" data-telefone="${c.telefone}"
                  data-email="${c.email}" data-endereco="${c.endereco}" data-cidade="${c.cidade}">
                  Editar
                </button>`
            }
            if (botaoDeletar) {
              acoes += `
                <button class="btn btn-sm btn-danger btn-deletar ms-1"
                  data-id="${c.id}" data-nome="${c.nome}">
                  Deletar
                </button>`
            }
            return `
              <tr>
                <td><span class="badge bg-secondary">${c.id}</span></td>
                <td>${c.nome}</td>
                <td>${c.telefone}</td>
                <td>${c.email}</td>
                <td>${c.endereco}</td>
                <td>${c.cidade}</td>
                ${acoes ? `<td>${acoes}</td>` : ""}
              </tr>`
          }).join("")}
        </tbody>
      </table>
    `

    // Botões editar
    document.querySelectorAll(".btn-selecionar").forEach(btn => {
      btn.addEventListener("click", () => preencherFormularioEdicao(btn.dataset))
    })

    // Botões deletar
    document.querySelectorAll(".btn-deletar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const { id, nome } = btn.dataset
        if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) return
        try {
          await deletarContato(id)
          await renderizarContatos({ botaoDeletar: true })
        } catch (error) {
          alert("Erro ao deletar: " + error.message)
        }
      })
    })

  } catch (error) {
    container.innerHTML = `<p class="text-danger">Erro ao carregar contatos.</p>`
  }
}

// ─── Página: Cadastrar ────────────────────────────────────────────────────────

function initCadastrar() {
  renderizarContatos()

  document.getElementById("form-cadastro").addEventListener("submit", async (event) => {
    event.preventDefault()

    const contato = {
      nome:     document.getElementById("input-nome").value.trim(),
      telefone: document.getElementById("input-telefone").value.trim(),
      email:    document.getElementById("input-email").value.trim(),
      endereco: document.getElementById("input-endereco").value.trim(),
      cidade:   document.getElementById("input-cidade").value.trim(),
    }

    try {
      await criarContato(contato)
      document.getElementById("form-cadastro").reset()
      await renderizarContatos()
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message)
    }
  })
}

// ─── Página: Editar ───────────────────────────────────────────────────────────

function preencherFormularioEdicao({ id, nome, telefone, email, endereco, cidade }) {
  document.getElementById("contato-id").value      = id
  document.getElementById("titulo-id").textContent  = `#${id}`
  document.getElementById("input-nome").value      = nome
  document.getElementById("input-telefone").value  = telefone
  document.getElementById("input-email").value     = email
  document.getElementById("input-endereco").value  = endereco
  document.getElementById("input-cidade").value    = cidade

  const form = document.getElementById("form-editar")
  form.classList.remove("d-none")
  form.scrollIntoView({ behavior: "smooth" })
}

function initEditar() {
  renderizarContatos({ botaoEditar: true })

  document.getElementById("btn-cancelar").addEventListener("click", () => {
    document.getElementById("form-editar").classList.add("d-none")
  })

  document.getElementById("form-editar").addEventListener("submit", async (event) => {
    event.preventDefault()

    const id = document.getElementById("contato-id").value
    const contato = {
      nome:     document.getElementById("input-nome").value.trim(),
      telefone: document.getElementById("input-telefone").value.trim(),
      email:    document.getElementById("input-email").value.trim(),
      endereco: document.getElementById("input-endereco").value.trim(),
      cidade:   document.getElementById("input-cidade").value.trim(),
    }

    try {
      await atualizarContato(id, contato)
      document.getElementById("form-editar").classList.add("d-none")
      await renderizarContatos({ botaoEditar: true })
    } catch (error) {
      alert("Erro ao atualizar: " + error.message)
    }
  })
}

// ─── Página: Deletar ──────────────────────────────────────────────────────────

function initDeletar() {
  renderizarContatos({ botaoDeletar: true })
}

// ─── Detectar página e inicializar ───────────────────────────────────────────

const pagina = window.location.pathname.split("/").pop()

if (pagina === "index.html") initCadastrar()
else if (pagina === "editar.html")   initEditar()
else if (pagina === "deletar.html")  initDeletar()
