/* convertDurationToTimeString: funcao com objetivo de tranformar a duracao do tempo do episodio, que estava em segundo, em horas, minutos e segundos. Por isso, ve-se necessario 
 * transforma-lo em uma string e depois expoerta-lo para onde fosse necessario.
 */ 

export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration /3600);
    const minute = Math.floor((duration %3600)/60);
    const seconds = duration % 60;

    const timeString = [hours,minute,seconds].map(unit => String(unit).padStart(2,'0')) // padStart: adiciona o zero aos horarios que tem apenas um numero.
    .join(':')

    return timeString
}

