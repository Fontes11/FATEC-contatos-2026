import { getContatos, criarContato, atualizarContato, deletarContato } from "./contatos.js"
import { preview } from "./previw.js"

// ─── Instância do modal (criada uma única vez) ────────────────────────────────

let modalEditar = null

window.addEventListener("DOMContentLoaded", () => {
  modalEditar = new bootstrap.Modal(document.getElementById("modal-editar"))
  renderizarContatos()
  initCadastrar()
  initEditar()
})

// ─── Renderizar cards ─────────────────────────────────────────────────────────

async function renderizarContatos() {
  const container = document.getElementById("lista-contatos")
  if (!container) return

  container.innerHTML = `<div class="col"><p class="text-secondary">Carregando contatos...</p></div>`

  try {
    const contatos = await getContatos()

    if (!contatos || contatos.length === 0) {
      container.innerHTML = `<div class="col"><p class="text-secondary">Nenhum contato cadastrado ainda.</p></div>`
      return
    }

    container.innerHTML = contatos.map(c => `
      <div class="col">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">

            <!-- Avatar + nome -->
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center fw-bold text-primary"
                style="width:46px;height:46px;flex-shrink:0;font-size:1.1rem;">
                ${c.nome ? c.nome.charAt(0).toUpperCase() : "?"}
              </div>
              <div class="overflow-hidden">
                <h6 class="card-title mb-0 text-truncate">${c.nome ?? "—"}</h6>
                <small class="text-secondary">#${c.id}</small>
              </div>
            </div>

            <!-- Dados -->
            <div class="small text-secondary d-flex flex-column gap-1">
              <span>📞 ${c.telefone ?? "—"}</span>
              <span class="text-truncate">✉️ ${c.email ?? "—"}</span>
              <span class="text-truncate">📍 ${c.endereco ?? "—"}, ${c.cidade ?? "—"}</span>
            </div>

          </div>
          <div class="card-footer bg-transparent border-top d-flex gap-2 pt-2">
            <button class="btn btn-sm btn-outline-warning flex-fill btn-editar"
              data-id="${c.id}"
              data-nome="${c.nome ?? ""}"
              data-telefone="${c.telefone ?? ""}"
              data-email="${c.email ?? ""}"
              data-endereco="${c.endereco ?? ""}"
              data-cidade="${c.cidade ?? ""}">
              ✏️ Editar
            </button>
            <button class="btn btn-sm btn-outline-danger flex-fill btn-deletar"
              data-id="${c.id}"
              data-nome="${c.nome ?? ""}">
              🗑 Deletar
            </button>
          </div>
        </div>
      </div>
    `).join("")

    // Eventos dos botões
    container.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => abrirModalEdicao(btn.dataset))
    })

    container.querySelectorAll(".btn-deletar").forEach(btn => {
      btn.addEventListener("click", () => confirmarDeletar(btn.dataset))
    })

  } catch (error) {
    container.innerHTML = `<div class="col"><p class="text-danger">Erro ao carregar contatos: ${error.message}</p></div>`
  }
}

// ─── Abrir modal de edição ────────────────────────────────────────────────────

function abrirModalEdicao({ id, nome, telefone, email, endereco, cidade }) {
  document.getElementById("contato-id").value      = id
  document.getElementById("titulo-id").textContent = `#${id}`
  document.getElementById("edit-nome").value        = nome
  document.getElementById("edit-telefone").value    = telefone
  document.getElementById("edit-email").value       = email
  document.getElementById("edit-endereco").value    = endereco
  document.getElementById("edit-cidade").value      = cidade

  modalEditar.show()
}

// ─── Submit editar ────────────────────────────────────────────────────────────

function initEditar() {
  document.getElementById("form-editar").addEventListener("submit", async (event) => {
    event.preventDefault()

    const id = document.getElementById("contato-id").value
    const contato = {
      nome:     document.getElementById("edit-nome").value.trim(),
      telefone: document.getElementById("edit-telefone").value.trim(),
      email:    document.getElementById("edit-email").value.trim(),
      endereco: document.getElementById("edit-endereco").value.trim(),
      cidade:   document.getElementById("edit-cidade").value.trim(),
    }

    try {
      await atualizarContato(id, contato)
      modalEditar.hide()
      await renderizarContatos()
    } catch (error) {
      alert("Erro ao atualizar: " + error.message)
    }
  })
}

// ─── Deletar ──────────────────────────────────────────────────────────────────

async function confirmarDeletar({ id, nome }) {
  if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) return
  try {
    await deletarContato(id)
    await renderizarContatos()
  } catch (error) {
    alert("Erro ao deletar: " + error.message)
  }
}

// ─── Cadastrar ────────────────────────────────────────────────────────────────

function initCadastrar() {
  document.getElementById("form-cadastro").addEventListener("submit", async (event) => {
    event.preventDefault()

    const contato = {
      nome:     document.getElementById("cad-nome").value.trim(),
      telefone: document.getElementById("cad-telefone").value.trim(),
      email:    document.getElementById("cad-email").value.trim(),
      endereco: document.getElementById("cad-endereco").value.trim(),
      cidade:   document.getElementById("cad-cidade").value.trim(),
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
