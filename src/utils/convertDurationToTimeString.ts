// convertDurationToTimeString: função com objetivo de tranformar a duração do tempo do episódio, que estava em segundo para horas, minutos e segundos - é transformado em uma string. 

export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration /3600);
    const minute = Math.floor((duration %3600)/60);
    const seconds = duration % 60;

    const timeString = [hours,minute,seconds].map(unit => String(unit).padStart(2,'0')) // padStart: adiciona o zero aos horários que tem apenas um número.
    .join(':')

    return timeString
}

