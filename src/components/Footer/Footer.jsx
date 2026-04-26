import React from "react";
import House from "../../assets/house.svg";

import Styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={Styles.Footer}>
      <div className={Styles.Container}>
        <section className={Styles.Brand}>
          <div className={Styles.BrandContainer}>
            <img
              className={Styles.imgHouseBrand}
              src={House}
              alt="Imagem da casinha"
            />

            <h2 className={Styles.TituloBrand}>Sistema de Gestão de Abrigos</h2>
          </div>
          <div className={Styles.DivTextBrand}>
            <p className={Styles.TextBrand}>
              Organização e agilidade na gestão de vagas em situações de
              emergência
            </p>
          </div>
        </section>

        <section className={Styles.Contatos}>
          <h3 className={Styles.TituloContatos}>Contatos úteis</h3>
          <div className={Styles.SectionContatos}>
            <ul className={Styles.ListaContatos}>
              <li>
                <h4>Defesa Civil</h4>
                <p>
                  <a href="tel:199">199</a>
                </p>
              </li>
              <li>
                <h4>Bombeiros</h4>
                <p>
                  <a href="tel:193">193</a>
                </p>
              </li>
              <li>
                <h4>Suporte</h4>
                <p>
                  <a href="mailto:abrigos@enchentes.gov.br">
                    abrigos@enchentes.gov.br
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <hr className={Styles.Divider} />
      <section className={Styles.SecaoCopy}>
        <p className={Styles.Copy}>
          © 2026 Desenvolvido por Paulo Henrique Moreira - Sistema de Gestão de
          Abrigos para auxiliar em situações de enchentes no Brasil
        </p>
      </section>
    </footer>
  );
}
