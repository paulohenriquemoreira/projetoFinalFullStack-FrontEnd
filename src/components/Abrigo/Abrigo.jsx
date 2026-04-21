import React from 'react'

import Styles from "../Abrigo/Abrigo.module.scss"

export default function Abrigo() {
  return (
    <section className={Styles.Abrigos}>
      <div className={Styles.ContainerTitulo}>
        <h2 className={Styles.ContainerTitulo}>Abrigos Cadastrados</h2>
      </div>
      <section className={Styles.ContainerAccordion}>

      </section>
    </section>
  )
}
