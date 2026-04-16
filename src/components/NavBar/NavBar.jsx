import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";

import House from "../../assets/house.svg"

import Home from "../Home/Home"
import Abrigos from "../Abrigo/Abrigo"

import Styles from "./NavBar.module.scss"


export default function NavBar() {
  return (
    <BrowserRouter>
        <nav className={Styles.Navbar}>
           <section className={Styles.imgTitulo}>
                <Link to='/'>
                        <img  className={Styles.ImgHouse} src={House} alt="Imagem da casinha" />
                    </Link>
                    <h1 className={Styles.TituloNavBar}>Sistema de Gestão de Abrigos</h1>
           </section>
            <ul className={Styles.ListaNavBar}>
                <li>
                    <Link className={Styles.ListaItemNav} to='/'>Home</Link>                    
                </li>
                <li>
                    <Link className={Styles.ListaItemNav} to='/abrigos'>Abrigos</Link>
                </li>
            </ul>
        </nav>

        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/abrigos' element={<Abrigos/>}/>
        </Routes>
        
    </BrowserRouter>
  )
}
