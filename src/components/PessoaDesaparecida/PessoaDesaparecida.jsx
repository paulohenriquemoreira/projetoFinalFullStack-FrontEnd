import React, { useState, useEffect } from "react";
import Styles from "./PessoaDesaparecida.module.scss";

export default function PessoaForm() {
  // useEffect para travar a altura da tela no mobile
  useEffect(() => {
    const setFixedViewport = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setFixedViewport();
    window.addEventListener("resize", () => {
      setTimeout(setFixedViewport, 100);
    });

    return () => window.removeEventListener("resize", setFixedViewport);
  }, []);

  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    endereco_residencial: "",
  });

  const [carregando, setCarregando] = useState(false);

  // Estados para a Lógica de Pesquisa e Scroll
  const [pesquisando, setPesquisando] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [pessoaEncontrada, setPessoaEncontrada] = useState(null);
  const [pessoasDesaparecidas, setPessoasDesaparecidas] = useState([]);

  // 1. Carrega APENAS pessoas desaparecidas na API para popular o Scroll
  useEffect(() => {
    const carregarPessoas = async () => {
      try {
        const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/pessoas');
        const dados = await resposta.json();
        
        if (resposta.ok) {
          const apenasDesaparecidos = dados.filter((p) => !p.nome_abrigo);
          setPessoasDesaparecidas(apenasDesaparecidos);
        }
      } catch (error) {
        console.error("Erro ao buscar pessoas para o scroll:", error);
      }
    };
    carregarPessoas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Se o usuário alterar dados após pesquisar, bloqueia o salvamento e limpa a busca
    if (
      name === "nome_completo" ||
      name === "data_nascimento" ||
      name === "endereco_residencial"
    ) {
      setBuscaRealizada(false);
      setPessoaEncontrada(null);
    }
  };

  // 2. Pesquisa Inteligente
  const handlePesquisar = async () => {
    if (!form.nome_completo || !form.data_nascimento || !form.endereco_residencial) {
      alert("⚠️ Preencha Nome Completo, Data de Nascimento e Endereço Residencial para pesquisar.");
      return;
    }

    setPesquisando(true);
    setPessoaEncontrada(null);

    try {
      const resposta = await fetch("https://projetofinalfullstack-backend-api.onrender.com/pessoas");
      const pessoas = await resposta.json();

      const existente = pessoas.find(
        (p) =>
          p.nome_completo.toLowerCase() === form.nome_completo.toLowerCase() &&
          p.data_nascimento === form.data_nascimento &&
          p.endereco_residencial.toLowerCase() === form.endereco_residencial.toLowerCase(),
      );

      if (existente) {
        if (existente.nome_abrigo) {
          setPessoaEncontrada(existente);
        } else {
          alert("⚠️ Atenção: Esta pessoa já consta no sistema como DESAPARECIDA (ela já está no painel acima).");
        }
      } else {
        alert("✅ Pessoa não localizada no sistema. Pode prosseguir com o registro de Pessoa Desaparecida.");
      }

      setBuscaRealizada(true);
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
      alert("❌ Erro ao conectar com o servidor para pesquisa.");
    } finally {
      setPesquisando(false);
    }
  };

  // 3. Salva a nova pessoa desaparecida e atualiza o Scroll
  const handleSalvar = async () => {
    if (!form.nome_completo || !form.data_nascimento || !form.endereco_residencial) {
      alert("Por favor, preencha todos os campos habilitados.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(
        "https://projetofinalfullstack-backend-api.onrender.com/pessoas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const contentType = resposta.headers.get("content-type");
      let dados = {};

      if (contentType && contentType.includes("application/json")) {
        dados = await resposta.json();
      } else {
        await resposta.text();
        throw new Error("O servidor da API falhou e retornou uma página de erro.");
      }

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao salvar no banco de dados.");
      }

      alert("✅ Pessoa registrada como DESAPARECIDA com sucesso!");
      setPessoasDesaparecidas((prev) => [...prev, form]);
      handleCancelar();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(`❌ ${error.message}`);
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
    });
    setBuscaRealizada(false);
    setPessoaEncontrada(null);
  };

  //Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
  const formatarDataBR = (dataISO) => {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO; // Caso já venha formatada
  };

  return (
    <section className={Styles.SecaoPessoas}>
      
      {/* INFINITE SCROLL NO TOPO */}
      <div className={Styles.PainelDesaparecidos}>
        <h2 className={Styles.PainelTitulo}>Pessoas Desaparecidas</h2>
        {pessoasDesaparecidas.length > 0 ? (
          <div className={Styles.scrollWrapper}>
            <div className={Styles.scrollContainer}>
              {/* Lista Original (Com formatação aplicada) */}
              {pessoasDesaparecidas.map((p, index) => (
                <div key={`orig-${index}`} className={Styles.scrollItem}>
                  <strong>{p.nome_completo}</strong> | Nasc: {formatarDataBR(p.data_nascimento)} | {p.endereco_residencial}
                </div>
              ))}
              {/* Lista Duplicada para o Efeito de Loop (Com formatação aplicada) */}
              {pessoasDesaparecidas.map((p, index) => (
                <div key={`dup-${index}`} className={Styles.scrollItem} aria-hidden="true">
                  <strong>{p.nome_completo}</strong> | Nasc: {formatarDataBR(p.data_nascimento)} | {p.endereco_residencial}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={Styles.PainelVazio}>Nenhum registro carregado.</p>
        )}
      </div>

      <section className={Styles.forms}>
        <div className={Styles.ContainerTitulo}>
          <h2>Busca e Cadastro de Pessoas</h2>
        </div>

        {/* ALERTA: PESSOA ENCONTRADA */}
        {pessoaEncontrada && (
          <div className={Styles.alertWarningBox}>
            <h3 className={Styles.alertWarningTitle}>⚠️ Pessoa já Abrigada/Alojada!</h3>
            <p><strong>Nome:</strong> {pessoaEncontrada.nome_completo}</p>
            <p><strong>Abrigo:</strong> {pessoaEncontrada.nome_abrigo || "Não informado"}</p>
            <p><strong>Endereço do Abrigo:</strong> {pessoaEncontrada.endereco_abrigo || "Não informado"}</p>
            <p><strong>Registrado em:</strong> {pessoaEncontrada.data_cadastrada || "Data indisponível"}</p>
          </div>
        )}

        <form>
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
          </div>

          <div className={Styles.group}>
            <label>Endereço Residencial (Origem)</label>
            <input
              type="text"
              name="endereco_residencial"
              value={form.endereco_residencial}
              onChange={handleChange}
              placeholder="Endereço de origem da pessoa"
            />
          </div>

          <div className={Styles.group}>
            <button
              type="button"
              onClick={handlePesquisar}
              disabled={pesquisando}
              className={Styles.btnBuscar}
            >
              {pesquisando ? "..." : "🔍 Pesquisar"}
            </button>
          </div>
          
          <div className={Styles.ContainerButtons}>
            <button
              className={`${Styles.Buttons} ${Styles.ButtonsCancelar}`}
              type="button"
              onClick={handleCancelar}
              disabled={carregando}
            >
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