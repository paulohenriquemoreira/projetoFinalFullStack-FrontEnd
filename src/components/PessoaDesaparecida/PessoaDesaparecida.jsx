import React, { useState, useEffect } from "react";
import Styles from "./PessoaDesaparecida.module.scss";

export default function PessoaForm() {
  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    endereco_residencial: "",
    id_abrigo: "",
  });

  const [abrigosLista, setAbrigosLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  
  // Estados para a Lógica de Pesquisa
  const [pesquisando, setPesquisando] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [pessoaEncontrada, setPessoaEncontrada] = useState(null);

  // 1. Carrega os Abrigos no Dropdown (CORREÇÃO: Endpoint /abrigos)
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
    
    // Se o usuário alterar nome ou data após pesquisar, bloqueia o salvamento e limpa a busca
    if (name === "nome_completo" || name === "data_nascimento") {
      setBuscaRealizada(false);
      setPessoaEncontrada(null);
    }
  };

  // 2. Pesquisa se a pessoa já existe (Endpoint /pessoas)
  const handlePesquisar = async () => {
    if (!form.nome_completo || !form.data_nascimento) {
      alert("⚠️ Preencha Nome Completo e Data de Nascimento para pesquisar.");
      return;
    }

    setPesquisando(true);
    setPessoaEncontrada(null);

    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/pessoas');
      const pessoas = await resposta.json();

      const existente = pessoas.find(p => 
        p.nome_completo.toLowerCase() === form.nome_completo.toLowerCase() &&
        p.data_nascimento === form.data_nascimento
      );

      if (existente) {
        setPessoaEncontrada(existente);
      } else {
        alert("✅ Pessoa não localizada em nenhum abrigo. Pode prosseguir com o registro.");
      }
      
      setBuscaRealizada(true);
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
      alert("❌ Erro ao conectar com o servidor para pesquisa.");
    } finally {
      setPesquisando(false);
    }
  };

  // 3. Salva a nova pessoa desaparecida vinculando ao abrigo (Endpoint /pessoas)
  const handleSalvar = async () => {
    if (!form.id_abrigo || !form.endereco_residencial) {
      alert("Por favor, preencha todos os campos habilitados.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/pessoas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(`❌ ${dados.mensagem}`);
        setCarregando(false);
        return;
      }

      alert("✅ Pessoa registrada no sistema com sucesso!");
      handleCancelar(); 
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // 4. Limpa todo o formulário
  const handleCancelar = () => {
    setForm({
      nome_completo: "",
      data_nascimento: "",
      endereco_residencial: "",
      id_abrigo: "",
    });
    setBuscaRealizada(false);
    setPessoaEncontrada(null);
  };

  return (
    <section className={Styles.SecaoPessoas}>
      <section className={Styles.forms}>
        <div className={Styles.ContainerTitulo}>
          <h2>Busca e Cadastro de Pessoas</h2>
        </div>

        {/* ALERTA: PESSOA ENCONTRADA */}
        {pessoaEncontrada && (
          <div className={Styles.alertWarningBox}>
            <h3 className={Styles.alertWarningTitle}>⚠️ Pessoa já abrigada!</h3>
            <p><strong>Nome:</strong> {pessoaEncontrada.nome_completo}</p>
            <p><strong>Abrigo:</strong> {pessoaEncontrada.nome_abrigo}</p>
            <p><strong>Endereço do Abrigo:</strong> {pessoaEncontrada.endereco_abrigo}</p>
            <p><strong>Registrado em:</strong> {pessoaEncontrada.data_cadastrada}</p>
          </div>
        )}

        <form>
          {/* CAMPOS DE PESQUISA LADO A LADO */}
          <div className={Styles.groupRow}>
            <div className={Styles.group} style={{ flex: 2 }}>
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome_completo"
                value={form.nome_completo}
                onChange={handleChange}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className={Styles.group} style={{ flex: 1 }}>
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div className={Styles.group} style={{ justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={handlePesquisar}
                disabled={pesquisando}
                className={Styles.btnBuscar}
              >
                {pesquisando ? "..." : "🔍 Pesquisar"}
              </button>
            </div>
          </div>

          {/* CAMPOS FIXOS (Só habilitam após a pesquisa ser feita e não encontrar ninguém) */}
          <div className={Styles.group}>
            <label>Endereço Residencial (Origem)</label>
            <input
              type="text"
              name="endereco_residencial"
              value={form.endereco_residencial}
              onChange={handleChange}
              placeholder="Endereço de origem da pessoa"
              disabled={!buscaRealizada || pessoaEncontrada}
            />
          </div>

          <div className={Styles.group}>
            <label>Vincular a qual Abrigo?</label>
            <select 
              name="id_abrigo" 
              value={form.id_abrigo} 
              onChange={handleChange}
              disabled={!buscaRealizada || pessoaEncontrada}
            >
              <option value="">Selecione um abrigo</option>
              {abrigosLista.map((abrigo) => (
                <option key={abrigo.id} value={abrigo.id} disabled={abrigo.vagas_disponiveis <= 0}>
                  {abrigo.nome_abrigo} ({abrigo.vagas_disponiveis > 0 ? `${abrigo.vagas_disponiveis} vagas` : "Lotação máxima"})
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.ContainerButtons}>
            <button className={`${Styles.Buttons} ${Styles.ButtonsCancelar}`}  type="button" onClick={handleCancelar} disabled={carregando}>
              Cancelar
            </button>

            <button 
              className={`${Styles.Buttons} ${Styles.ButtonSalvar}`} 
              type="button" 
              onClick={handleSalvar}
              disabled={carregando || !buscaRealizada || pessoaEncontrada}
            >
              {carregando ? "Salvando..." : "Salvar Registro"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}