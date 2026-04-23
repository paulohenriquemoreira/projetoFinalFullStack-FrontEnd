import React from "react";
import Styles from "./Abrigo.module.scss";


export default function AbrigoItem({ abrigo, isActive, onShow }) {
  // Variável para verificar se o abrigo está sem vagas
  const isEsgotado = abrigo.vagas_disponiveis <= 0;

  return (
    <section className={Styles.accordionItem}>
      {/* CABEÇALHO */}
      <div
        onClick={onShow}
        className={`${Styles.accordionHeader} ${isActive ? Styles.active : ""}`}
      >
        <div className={Styles.headerTitle}>
          <div className={Styles.Circulo}></div>
          <div>
            <h3>{abrigo.nome_abrigo || "NOME DO ABRIGO"}</h3>
            
            {/* Se estiver esgotado, mostra Lotação Máxima. Se não, mostra as vagas. */}
            <span className={Styles.subtitle}>
              {isEsgotado ? "Lotação Máxima" : `${abrigo.vagas_disponiveis} vagas disponíveis`}
            </span>
          </div>
        </div>
        <span className={Styles.icon}>{isActive ? "ᐱ" : "ᐯ"}</span>
      </div>

      {/* DETALHES */}
      {isActive && (
        <section className={Styles.accordionBody}>
          <div className={Styles.detailRow}>
            <span className={Styles.label}>Nome Abrigo</span>
            <span className={Styles.value}>{abrigo.nome_abrigo}</span>
          </div>
          
          <div className={Styles.detailRow}>
            <span className={Styles.label}>Endereço Abrigo</span>
            <span className={Styles.value}>{abrigo.endereco_abrigo}</span>
          </div>
          
          <div className={Styles.detailRow}>
            <span className={Styles.label}>Capacidade Total</span>
            <span className={Styles.value}>{abrigo.capacidade_total}</span>
          </div>
          
          {/* MÁGICA DA BADGE DINÂMICA AQUI */}
          <div className={Styles.detailRow}>
            <span className={Styles.label}>Vagas Disponíveis</span>
            <div>
              {isEsgotado ? (
                <span className={Styles.badgeEsgotado}>
                  ESGOTADO
                </span>
              ) : (
                <span className={Styles.badgeGreen}>
                  {abrigo.vagas_disponiveis} vagas
                </span>
              )}
            </div>
          </div>
        </section>
      )}

    </section>
  );
}