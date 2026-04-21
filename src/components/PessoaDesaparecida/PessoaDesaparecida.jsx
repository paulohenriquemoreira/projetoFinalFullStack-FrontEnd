import { useState } from "react";
import Styles from "./PessoaDesaparecida.module.scss";

export default function PessoaForm() {
  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    endereco: "",
    abrigo: "",
    data_registro: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSalvar = () => {
    const dataAtual = new Date().toISOString().split("T")[0];

    const novoRegistro = {
      ...form,
      data_registro: dataAtual,
    };

    setForm(novoRegistro);

    console.log("Dados enviados:", novoRegistro);

    // Aqui entra o POST para API
  };

  const handleCancelar = () => {
    setForm({
      nome_completo: "",
      data_nascimento: "",
      endereco: "",
      abrigo: "",
      data_registro: "",
    });
  };

  return (
    <section className={Styles.SecaoPessoas}>
      <section className={Styles.forms}>
        <div className={Styles.ContainerTitulo}>
          <h2>Cadastro de Pessoa Desaparecida</h2>
        </div>

        {form.data_registro && (
          <p className={Styles.dataRegistro}>
            Data de Registro: {form.data_registro}
          </p>
        )}

        <form>
          <div className={Styles.group}>
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
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
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          <div className={Styles.group}>
            <label>Selecionar Abrigo</label>
            <select name="abrigo" value={form.abrigo} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Abrigo 1">Abrigo 1</option>
              <option value="Abrigo 2">Abrigo 2</option>
            </select>
          </div>

          <div className={Styles.ContainerButtons}>
            <button className={Styles.Buttons} type="button" onClick={handleCancelar}>
              Cancelar
            </button>

            <button className={`${Styles.Buttons} ${Styles.ButtonSalvar}`} type="button" onClick={handleSalvar}>
              Salvar
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
