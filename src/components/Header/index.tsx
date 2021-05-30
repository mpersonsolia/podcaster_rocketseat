import format from 'date-fns/format' // extensão para data
import ptBR from 'date-fns/locale/pt-BR' // extensão para data com localidade

import styles from  "./styles.module.scss"; // estilizacao

// Header: tag que cuida do cabecalho
export function Header(){
    const currentDate = format(new Date(), 'EEEE, d MMMM',{
        locale: ptBR,
    }) // permite apresentar a data atual.
    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr" />
            <p>O melhor para você ouvir, sempre!</p>
            <span>{currentDate}</span>
        </header>
    );
}