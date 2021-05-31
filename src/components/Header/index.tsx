import format from 'date-fns/format' // extensão para data
import ptBR from 'date-fns/locale/pt-BR' // extensão para data com localidade brasileira

import styles from  "./styles.module.scss"; // estilização global

// Header: tag para o cabeçalho da página
export function Header(){
    const currentDate = format(new Date(), 'EEEE, d MMMM',{
        locale: ptBR,
    }) // currentDate: apresenta a data do dia, sem necessidade de atualização manual.
    return (
        <header className = {styles.headerContainer}>
            <img src = "/logo.svg" alt="Podcastr"/>
            <p>O melhor para você ouvir, sempre!</p>
            <span>{currentDate}</span>
        </header>
    );
}