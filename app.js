import { getContatos, criarContato, atualizarContato, deletarContato } from "./contatos.js"
 
const form = document.querySelector("form")
 
form.addEventListener("submit", async (event) => {
  event.preventDefault()
 
  const contato = {
    nome:     document.getElementById("input-nome").value.trim(),
    telefone: document.getElementById("input-telefone").value.trim(),
    email:    document.getElementById("input-email").value.trim(),
    endereco: document.getElementById("input-endereco").value.trim(),
    cidade:   document.getElementById("input-cidade").value.trim(),
  }
 
  console.log("Enviando contato:", contato)
 
  try {
    const resultado = await criarContato(contato)
    console.log("Resposta do backend:", resultado)
    alert("Contato salvo com sucesso!")
    form.reset()
  } catch (error) {
    console.error("Erro:", error)
    alert("Erro ao salvar contato: " + error.message)
  }
})