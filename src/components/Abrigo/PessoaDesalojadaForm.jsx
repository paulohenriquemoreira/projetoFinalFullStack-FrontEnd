import React, { useState, useEffect } from "react";
import Styles from "./Abrigo.module.scss"; 

export default function PessoaDesalojadaForm({ onCancelar, onSucesso }) {
  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    endereco_residencial: "",
    id_abrigo: "",
  });

  const [abrigosLista, setAbrigosLista] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [pesquisando, setPesquisando] = useState(false);

  // Estados de Controle do Fluxo
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("novo"); // "novo", "desaparecido_encontrado" ou "abrigado"
  const [pessoaExistente, setPessoaExistente] = useState(null);

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

    // Se o usuário alterar nome ou data após buscar, a busca é resetada
    if (name === "nome_completo" || name === "data_nascimento") {
      setBuscaRealizada(false);
      setModoFormulario("novo");
      setPessoaExistente(null);
    }
  };

  const handlePesquisar = async () => {
    if (!form.nome_completo || !form.data_nascimento) {
      alert("⚠️ Preencha Nome Completo e Data de Nascimento para pesquisar.");
      return;
    }

    setPesquisando(true);
    try {
      const resposta = await fetch("https://projetofinalfullstack-backend-api.onrender.com/pessoas");
      const pessoas = await resposta.json();

      // Procura alguém com o mesmo nome e data de nascimento
      const existente = pessoas.find(
        (p) =>
          p.nome_completo.toLowerCase() === form.nome_completo.toLowerCase() &&
          p.data_nascimento === form.data_nascimento
      );

      if (existente) {
        if (existente.nome_abrigo) {
          // Já está em um abrigo
          alert(`❌ Esta pessoa já está ABRIGADA no abrigo: ${existente.nome_abrigo}`);
          setModoFormulario("abrigado");
        } else {
          // É uma pessoa desaparecida (nome_abrigo === null)
          alert("⚠️ Pessoa localizada na lista de DESAPARECIDOS! Os dados foram preenchidos. Selecione o abrigo para alojá-la.");
          setForm({
            ...form,
            endereco_residencial: existente.endereco_residencial || "",
          });
          setPessoaExistente(existente);
          setModoFormulario("desaparecido_encontrado");
        }
      } else {
        alert("✅ Pessoa não consta no sistema. Preencha o restante dos dados para registrar.");
        setModoFormulario("novo");
      }
      setBuscaRealizada(true);
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao conectar com o servidor para pesquisa.");
    } finally {
      setPesquisando(false);
    }
  };

  const handleSalvar = async () => {
    if (!form.nome_completo || !form.data_nascimento || !form.endereco_residencial || !form.id_abrigo) {
      alert("⚠️ Por favor, preencha todos os campos e selecione um Abrigo.");
      return;
    }

    setSalvando(true);
    try {
      // Se for um cadastro 100% novo (POST), se for um desaparecido atualiza o registro dele (PUT)
      let url = 'https://projetofinalfullstack-backend-api.onrender.com/pessoas';
      let method = 'POST';

      if (modoFormulario === "desaparecido_encontrado" && pessoaExistente) {
        url = `https://projetofinalfullstack-backend-api.onrender.com/pessoas/${pessoaExistente.id}`;
        method = 'PUT';
      }

      const resposta = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const contentType = resposta.headers.get("content-type");
      let dados = {};

      if (contentType && contentType.includes("application/json")) {
        dados = await resposta.json();
      } else {
        await resposta.text();
        throw new Error("O servidor da API falhou e retornou uma página de erro HTML.");
      }

      if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao salvar o registro.");

      alert("✅ Pessoa Desalojada registrada no abrigo com sucesso!");
      onSucesso();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  // Variáveis para controlar os bloqueios de tela baseados no status da busca
  const isBloqueado = modoFormulario === "desaparecido_encontrado" || modoFormulario === "abrigado";
  const isAbrigado = modoFormulario === "abrigado";

  return (
    <section className={Styles.formContainer}>
      <h2 className={Styles.formTitle}>Registrar Entrada no Abrigo</h2>

      <form className={Styles.formulario}>
        <div className={Styles.formRow}>
          <div className={Styles.formGroup} style={{ flex: 2 }}>
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              placeholder="Ex: Maria da Silva"
              disabled={isBloqueado && buscaRealizada}
            />
          </div>

          <div className={Styles.formGroup} style={{ flex: 1 }}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              disabled={isBloqueado && buscaRealizada}
            />
          </div>
        </div>

        {/* Botão de Busca que aparece antes do usuário terminar o formulário */}
        <div className={Styles.formGroup}>
          <button
            type="button"
            onClick={handlePesquisar}
            disabled={pesquisando || (buscaRealizada && isBloqueado)}
            className={Styles.btnBuscar}
          >
            {pesquisando ? "Pesquisando..." : "🔍 Buscar Pessoa"}
          </button>
        </div>

        <div className={Styles.formGroup}>
          <label>Endereço Residencial (Origem)</label>
          <input
            type="text"
            name="endereco_residencial"
            value={form.endereco_residencial}
            onChange={handleChange}
            placeholder="Endereço da pessoa antes do alojamento"
            disabled={isBloqueado}
          />
        </div>

        <div className={Styles.formGroup}>
          <label>Selecionar Abrigo de Destino</label>
          <select 
            name="id_abrigo" 
            value={form.id_abrigo} 
            onChange={handleChange}
            disabled={isAbrigado} // Só bloqueia a seleção se a pessoa JÁ estiver em um abrigo
          >
            <option value="">Selecione um abrigo com vagas</option>
            {abrigosLista.map((abrigo) => (
              <option key={abrigo.id} value={abrigo.id} disabled={abrigo.vagas_disponiveis <= 0}>
                {abrigo.nome_abrigo} ({abrigo.vagas_disponiveis > 0 ? `${abrigo.vagas_disponiveis} vagas` : "Lotação máxima"})
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.formActions}>
          <button type="button" className={Styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button 
            type="button" 
            className={Styles.btnSalvar} 
            onClick={handleSalvar} 
            disabled={salvando || isAbrigado || !buscaRealizada}
          >
            {salvando ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>
    </section>
  );
}