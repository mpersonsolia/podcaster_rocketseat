// _app: apresenta componentes compartilhados em todas as páginas, por isso permite manter o mesmo layout durante a navegação entre elas. ex.: menu, barra de ferramentas.
import "../styles/global.scss" //estilo global scss
import styles from '../styles/app.module.scss' //estilo scss específico

import React, { useState } from "react" // importação de hooks do React
import { Player } from "../components/Player" // // importação de função de outro arquivo do projeto
import { Header } from "../components/Header" // importação de função de outro arquivo do projeto
import { PlayerContext, PlayerContextProvider } from "../contexts/PlayerContext" // importação de função de outro arquivo do projeto

// function MyApp: o arquivo _app substitui a utilização do componente app, por isso é necessário adicionar a função MyApp.

function MyApp({ Component, pageProps }) { {/* Component: ativa os componentes presentes em todas páginas do projeto.*/}
return (
  <PlayerContextProvider>
    <div className = {styles.wrapper}>    
      <main>
      <Header/>
      <Component {...pageProps} /> {/* pageProps:*/}
      </main>
      <Player />
    </div>
    </PlayerContextProvider>
  )
}

export default MyApp
