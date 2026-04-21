import React, { useState, useEffect } from "react";
import Styles from "./PessoaDesaparecida.module.scss";

export default function PessoaForm() {
  // 1. Ajustei os nomes das chaves para ficarem exatamente iguais ao que o backend espera no req.body
  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    endereco_residencial: "", // Antes estava só 'endereco'
    id_abrigo: "",            // Antes estava só 'abrigo'
  });

  // Estado para armazenar a lista de abrigos vindos da API
  const [abrigosLista, setAbrigosLista] = useState([]);
  
  // Estados para feedback visual (Carregando, Sucesso, Erro)
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null); // Pode ser sucesso ou erro

  // 2. Buscar os abrigos ao carregar a tela para preencher o <select>
  useEffect(() => {
    const carregarAbrigos = async () => {
      try {
        const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/abrigos');
        const dados = await resposta.json();
        setAbrigosLista(dados);
      } catch (error) {
        console.error("Erro ao buscar abrigos:", error);
      }
    };
    carregarAbrigos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 3. Função para enviar os dados via POST
  const handleSalvar = async () => {
    // Validação básica de campos vazios
    if (!form.nome_completo || !form.data_nascimento || !form.endereco_residencial || !form.id_abrigo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);
    setMensagem(null); // Limpa mensagens anteriores

    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form) // Envia o state formatado como JSON
      });

      const dados = await resposta.json();

      // Verifica se a resposta NÃO foi OK (ex: Erro 400 de Duplicidade ou Sem Vaga)
      if (!resposta.ok) {
        // Lógica para tratar a DUPLICIDADE conforme o seu backend enviou no json 'localizacao'
        if (dados.localizacao) {
          alert(`⚠️ ${dados.mensagem}\n\nEncontrado no: ${dados.localizacao.abrigo}\nEndereço: ${dados.localizacao.endereco}\nRegistrado em: ${dados.localizacao.data_registro}`);
        } else {
          // Lógica para erro de "Abrigo sem vagas"
          alert(`❌ ${dados.mensagem}`);
        }
        setCarregando(false);
        return;
      }

      // Se passou pelas validações e a resposta for OK (Sucesso)
      alert("✅ Pessoa registrada com sucesso!");
      handleCancelar(); // Limpa os campos do formulário
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // 4. Limpa o formulário
  const handleCancelar = () => {
    setForm({
      nome_completo: "",
      data_nascimento: "",
      endereco_residencial: "",
      id_abrigo: "",
    });
  };

  return (
    <section className={Styles.SecaoPessoas}>
      <section className={Styles.forms}>
        <div className={Styles.ContainerTitulo}>
          <h2>Cadastro de Pessoa Desaparecida</h2>
        </div>

        <form>
          <div className={Styles.group}>
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className={Styles.group}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
            />
          </div>

          <div className={Styles.group}>
            <label>Endereço Residencial</label>
            <input
              type="text"
              name="endereco_residencial"
              value={form.endereco_residencial}
              onChange={handleChange}
              placeholder="Endereço de origem da pessoa"
            />
          </div>

          <div className={Styles.group}>
            <label>Selecionar Abrigo</label>
            <select name="id_abrigo" value={form.id_abrigo} onChange={handleChange}>
              <option value="">Selecione um abrigo</option>
              {/* Mapeando a lista de abrigos da API */}
              {abrigosLista.map((abrigo) => (
                <option key={abrigo.id} value={abrigo.id}>
                  {abrigo.nome_abrigo} ({abrigo.vagas_disponiveis > 0 ? `${abrigo.vagas_disponiveis} vagas` : "Lotação máxima"})
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.ContainerButtons}>
            <button className={Styles.Buttons} type="button" onClick={handleCancelar} disabled={carregando}>
              Cancelar
            </button>

            <button 
              className={`${Styles.Buttons} ${Styles.ButtonSalvar}`} 
              type="button" 
              onClick={handleSalvar}
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}