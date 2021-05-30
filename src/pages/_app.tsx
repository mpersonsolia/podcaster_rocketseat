/* _app: apresenta componentes compartilhados em todas as paginas. ex.: menu, barra de ferramentas.
 *      - permite manter o mesmo layout em todas as paginas e manter o seu estado durante a navegacao entre elas.
 */

import "../styles/global.scss" //estilo global scss

import { Header } from "../components/Header" // importacao da funcao de outro arquivo do projeto
import styles from '../styles/app.module.scss' //estilo scss
import { Player } from "../components/Player" // importacao da funcao de outro arquivo do projeto
import React, { useState } from "react"

import { PlayerContext, PlayerContextProvider } from "../contexts/PlayerContext"

/* function MyApp: o arquivo _app substitui a utilizacao do componente App.
 * Component: propriedade que ativa a 'page' e, ao navegar pelas rotas, o Component muda para a nova page. Por isso, tudo o que for enviado ao Component sera recebido pelas paginas.
 * pageProps: propriedade pre-carregada por data fetching (metodos de busca de dados).
 * 
 * Component e Headeder: sao compontes que devem ter acesso ao PlayerContext, adicionadas como variável por volta de ambos, através do PlayerContextProvider.
 */
function MyApp({ Component, pageProps }) {
return (
  <PlayerContextProvider>
    <div className = {styles.wrapper}>    
      <main>
      <Header/>
      <Component {...pageProps} />
      </main>
      <Player />
    </div>
    </PlayerContextProvider>
  )
}

export default MyApp
