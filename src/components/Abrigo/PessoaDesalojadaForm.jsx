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

  const handleSalvar = async () => {
    if (!form.nome_completo || !form.data_nascimento || !form.endereco_residencial || !form.id_abrigo) {
      alert("⚠️ Por favor, preencha todos os campos e selecione um Abrigo.");
      return;
    }

    setSalvando(true);
    try {
      const resposta = await fetch('https://projetofinalfullstack-backend-api.onrender.com/pessoas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!resposta.ok) throw new Error("Erro ao salvar");

      alert("✅ Pessoa Desalojada registrada no abrigo com sucesso!");
      onSucesso();
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao registrar. Pessoa já registrada.");
    } finally {
      setSalvando(false);
    }
  };

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
            />
          </div>

          <div className={Styles.formGroup} style={{ flex: 1 }}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={Styles.formGroup}>
          <label>Endereço Residencial (Origem)</label>
          <input
            type="text"
            name="endereco_residencial"
            value={form.endereco_residencial}
            onChange={handleChange}
            placeholder="Endereço da pessoa antes do alojamento"
          />
        </div>

        <div className={Styles.formGroup}>
          <label>Selecionar Abrigo de Destino</label>
          <select name="id_abrigo" value={form.id_abrigo} onChange={handleChange}>
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
          <button type="button" className={Styles.btnSalvar} onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>
    </section>
  );
}