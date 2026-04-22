import React, { useState } from 'react';
import Styles from './Abrigo.module.scss'; 


export default function AbrigoForm({ onCancelar, onSucesso }) {
  const [form, setForm] = useState({
    nome_abrigo: "",
    endereco_abrigo: "",
    capacidade_total: "",
    vagas_disponiveis: "",
    aceita_pet: "1" 
  });
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSalvar = async () => {
    if (!form.nome_abrigo || !form.endereco_abrigo || !form.capacidade_total || !form.vagas_disponiveis) {
      alert("Por favor, preencha todos os campos do abrigo.");
      return;
    }

    setSalvando(true);
    
    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/abrigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          capacidade_total: Number(form.capacidade_total),
          vagas_disponiveis: Number(form.vagas_disponiveis)
        })
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar no banco de dados.");
      }
      
      alert("✅ Abrigo cadastrado com sucesso!");
      onSucesso(); // Volta para a lista!
      
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao cadastrar abrigo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className={Styles.formContainer}>
      <h2 className={Styles.formTitle}>Cadastrar Novo Abrigo</h2>
      
      <form className={Styles.formulario}>
        <div className={Styles.formGroup}>
          <label>Nome do Abrigo</label>
          <input 
            type="text" 
            name="nome_abrigo" 
            value={form.nome_abrigo} 
            onChange={handleChange} 
            placeholder="Ex: Ginásio Municipal"
          />
        </div>

        <div className={Styles.formGroup}>
          <label>Endereço Completo</label>
          <input 
            type="text" 
            name="endereco_abrigo" 
            value={form.endereco_abrigo} 
            onChange={handleChange} 
            placeholder="Ex: Rua das Flores, 123"
          />
        </div>

        <div className={Styles.formRow}>
          <div className={Styles.formGroup}>
            <label>Capacidade Total</label>
            <input 
              type="number" 
              name="capacidade_total" 
              value={form.capacidade_total} 
              onChange={handleChange} 
              placeholder="Ex: 200"
            />
          </div>

          <div className={Styles.formGroup}>
            <label>Vagas Disponíveis</label>
            <input 
              type="number" 
              name="vagas_disponiveis" 
              value={form.vagas_disponiveis} 
              onChange={handleChange} 
              placeholder="Ex: 50"
            />
          </div>
        </div>

        <div className={Styles.formActions}>
          <button type="button" className={Styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          
          <button type="button" className={Styles.btnSalvar} onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Abrigo"}
          </button>
        </div>
      </form>
    </section>
  );
}