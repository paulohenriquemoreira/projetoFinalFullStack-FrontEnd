import React, { useState, useEffect } from 'react';
import AbrigoItem from './AbrigoItem';
import AbrigoForm from './AbrigoForm'; 
import Styles from './Abrigo.module.scss';
import IconeCasa from '../../assets/House.svg'; 

export default function Abrigo() {
  const [abrigos, setAbrigos] = useState([]);
  const [abrigoAbertoId, setAbrigoAbertoId] = useState(null);
  
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const buscarAbrigos = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/abrigos');
      if (!resposta.ok) {
        throw new Error('Falha ao buscar os dados dos abrigos');
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

  return (
    <section className={Styles.container}>
      
      {/* Header que alinha o título e o botão, e aplica o SCSS correto! */}
      <div className={Styles.headerContainer}>
        <h1 className={Styles.title}>Abrigos Cadastrados</h1>
        
        {!mostrandoFormulario && (
          <button 
            className={Styles.buttonAdd} 
            onClick={() => setMostrandoFormulario(true)}
          >
            + Adicionar Abrigo
          </button>
        )}
      </div>
      
      {/* Renderização Condicional (Mostra Form OU Mostra Lista) */}
      {mostrandoFormulario ? (
        <AbrigoForm 
          onCancelar={() => setMostrandoFormulario(false)} 
          onSucesso={() => {
            setMostrandoFormulario(false);
            buscarAbrigos(); 
          }} 
        />
      ) : (
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