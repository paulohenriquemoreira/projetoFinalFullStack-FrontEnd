import React from "react";
import { Link } from "react-router-dom";
import House from "../../assets/house.svg";
import Pessoas from "../../assets/pessoas.svg";
import Gota from "../../assets/gotaAgua.svg"
import Abrigos from "../Abrigo/Abrigo"
import PessoasDesaparecidas from "../PessoaDesaparecida/PessoaDesaparecida"
import Styles from "./Home.module.scss";

export default function Home() {
  return (
    <section className={Styles.SecaoHome}>
      <div className={Styles.SecaoTituloHome}>
        <h1 className={Styles.TituloHome}>
          Sistema de Gestão de Abrigos em Situações de Enchentes
        </h1>
        <p className={Styles.SubtituloHome}>
          Plataforma para organização e alocação de desabrigados em cenário de
          desastre. Facilitando a localização de pessoas desaparecidas, esforço
          voluntário e gestão eficiente de doações e vagas.
        </p>
      </div>
      <section className={Styles.CardsButtons}>
        <Link
          to="/abrigos"
          className={Styles.LinkCard}
          aria-label="Acessar página de abrigos"
        >
          <div className={Styles.Card}>
            <img
              className={Styles.CardImg}
              src={House}
              alt="Ícone da casinha"
            />
            <h3 className={Styles.CardTitulo}>Consultar Abrigos</h3>
            <p className={Styles.CardTexto}>
              Consulte abrigos disponíveis e gerencie vagas
            </p>
          </div>
        </Link>
        <Link
          to="/pessoadesaparecida"
          className={`${Styles.LinkCard} ${Styles.LinkCardPessoas}`}
          aria-label="Acessar página de pessoas desaparecidas"
        >
          <div className={Styles.Card}>
            <img
              className={Styles.CardImg}
              src={Pessoas}
              alt="Ícone de pessoas"
            />
            <h3 className={Styles.CardTitulo}>
              Registrar Pessoas Desaparecidas
            </h3>
            <p className={Styles.CardTexto}>
              Registre ou procure por pessoas desaparecidas
            </p>
          </div>
        </Link>
      </section>
      <section className={Styles.SecaoAviso}>
        <img  className={Styles.SecaoAvisoImg} src={Gota} alt="Ícone de Gota de Água" />
        <p className={Styles.SecaoAvisoTexto}>Em caso de enchentes, ligue 193 (Bombeiros) ou 199 (Defesa Civil)</p>
      </section>
    </section>
  );
}
