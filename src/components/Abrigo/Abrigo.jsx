import React, { useState, useEffect } from "react";
import AbrigoItem from "./AbrigoItem";
import AbrigoForm from "./AbrigoForm";
import PessoaDesalojadaForm from "./PessoaDesalojadaForm"; // <-- Novo Form
import Styles from "./Abrigo.module.scss";
import IconeCasa from "../../assets/house.svg";

export default function Abrigo() {
  // useEffect adicionado para travar a altura da tela no mobile
  useEffect(() => {
    const setFixedViewport = () => {
      // Pega a altura interna da janela e divide por 100 para achar 1%
      let vh = window.innerHeight * 0.01;
      // Define o valor na raiz do documento (variável --vh)
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Executa a primeira vez
    setFixedViewport();

    // Atualiza o valor apenas se o usuário girar a tela do aparelho
    window.addEventListener("resize", () => {
      // Um pequeno atraso para o navegador terminar de girar a tela
      setTimeout(setFixedViewport, 100);
    });

    return () => window.removeEventListener("resize", setFixedViewport);
  }, []);



  const [abrigos, setAbrigos] = useState([]);
  const [abrigoAbertoId, setAbrigoAbertoId] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // MUDANÇA AQUI: Controla qual tela renderizar ('lista', 'formAbrigo' ou 'formPessoa')
  const [telaAtual, setTelaAtual] = useState('lista'); 

  const buscarAbrigos = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch("https://projetofinalfullstack-backend-api.onrender.com/abrigos");
      if (!resposta.ok) {
        throw new Error("Falha ao buscar os dados dos abrigos");
      }
      const dados = await resposta.json();
      setAbrigos(dados);
      setCarregando(false);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Não foi possível carregar os abrigos no momento.");
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarAbrigos();
  }, []);

  if (carregando) {
    return (
      <section className={Styles.container}>
        <div className={Styles.loadingContainer}>
          <img src={IconeCasa} alt="Carregando..." className={Styles.loadingIcon} />
          <p className={Styles.loadingText}>Carregando abrigos...</p>
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className={Styles.container}>
        <p className={Styles.errorText}>{erro}</p>
      </section>
    );
  }

  //Altera Título da página de acordo com o botão acionado.
  const titulosDaTela = {
    lista: 'Abrigos Cadastrados',
    formAbrigo: 'Adicione novo abrigo',
    formPessoa: 'Adicione nova pessoa alojada'
  };

  return (
    <section className={Styles.container}>
      <div className={Styles.headerContainer}>
        <h1 className={Styles.title}>
          
          {titulosDaTela[telaAtual] || 'Abrigos Cadastrados'}  
        </h1>

        <div className={Styles.ContainerButton}>
          {telaAtual === 'lista' && (
            <>
              <button
                className={Styles.buttonAdd}
                onClick={() => setTelaAtual('formAbrigo')}
        
              >
                + Adicionar Abrigo
              </button>
              <button
                // Adicionei uma margem à esquerda para desgrudar os botões
                className={`${Styles.buttonAdd} ${Styles.buttonAddPessoas}`}
                onClick={() => setTelaAtual('formPessoa')}
              >
                + Adicionar Pessoa
              </button>
            </>
          )}
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DAS 3 TELAS */}
      {telaAtual === 'formAbrigo' && (
        <AbrigoForm
          onCancelar={() => setTelaAtual('lista')}
          onSucesso={() => {
            setTelaAtual('lista');
            buscarAbrigos();
          }}
        />
      )}

      {telaAtual === 'formPessoa' && (
        <PessoaDesalojadaForm
          onCancelar={() => setTelaAtual('lista')}
          onSucesso={() => {
            setTelaAtual('lista');
            buscarAbrigos(); // Atualiza abrigos pois uma vaga foi consumida
          }}
        />
      )}

      {telaAtual === 'lista' && (
        <>
          {abrigos.length === 0 ? (
            <p className={Styles.emptyText}>Nenhum abrigo cadastrado ainda.</p>
          ) : (
            abrigos.map((abrigo) => (
              <AbrigoItem
                key={abrigo._id || abrigo.id}
                abrigo={abrigo}
                isActive={abrigoAbertoId === (abrigo._id || abrigo.id)}
                onShow={() => {
                  const idAtual = abrigo._id || abrigo.id;
                  setAbrigoAbertoId(abrigoAbertoId === idAtual ? null : idAtual);
                }}
              />
            ))
          )}
        </>
      )}
    </section>
  );
}