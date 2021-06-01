import Image from 'next/image'; // extensão para modificar as propriedades da imagem
import { useRef, useEffect, useState } from 'react'; // importação de hooks do React

import Slider from 'rc-slider'; // extensão para o slider 
import 'rc-slider/assets/index.css'; // importação do estilo do slider

import styles from './styles.module.scss'; // estilização
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'; // importação de função de outro arquivo do projeto
import { usePlayer } from '../../contexts/PlayerContext'; // importação de função de outro arquivo do projeto

// Player: função que controla o áudio da sidebar.
// useRef:
// useState: determina o valor inicial do slider.
export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const{
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious, 
        hasNext,
        hasPrevious, 
        isLooping, 
        toggleLoop,
        toggleShuffle, 
        isShuffling, 
        clearPlayerState } = usePlayer();
        
    // useEffect: adiciona efeitos colaterais caso algo ocorra, isto é, o hook diz ao Ract para executar a função de efeito após a liberação de mudanças.
    useEffect(() => {
        if(!audioRef.current){
            return;
        } if(isPlaying){ 
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }), [isPlaying]

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })        
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount)  
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]    
    return (
        <div className = {styles.playerContainer}> {/*estilo da sidebar*/}
            <header>
                <img src = "/playing.svg" alt = "Tocando Agora"/> {/*imagem do headphone*/}
                <strong>Tocando Agora {episode?.title}</strong> {/*título da sidebar*/}
            </header>

            {episode ? (
                <div className = {styles.currentEpisode}> {/*características do espisódio enquanto estiver tocando na sidebar*/}
                  <Image 
                  width = {592} 
                  height = {592} 
                  src = {episode.thumbnail} 
                  objectFit = "cover"/>
                  <strong>{episode.title}</strong>
                  <strong>{episode.members}</strong>
                   </div> 
                ): (<div className = {styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir!</strong>
                </div>
                )}
            
            <footer className = {!episode ? styles.empty : ''}> {/*características da sidebar sem nenhum episódio tocando*/}
                <div className = {styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className = {styles.slider}>
                    {episode ? (
                        <Slider
                        max = {episode.duration}
                        value = {progress} 
                        onChange = {handleSeek}
                        trackStyle = {{ backgroundColor:'#04D361'}}
                        railStyle = {{backgroundColor: '#9F75FF'}} 
                        handleStyle = {{borderColor: '#04D361'}}/>
                    ) : (
                        <div className = {styles.emptySlider}/>
                    )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
 
                { episode && ( // <audio>: tag que adiciona o áudio ao projeto.
                    <audio
                    src = {episode.url}
                    ref = {audioRef}
                    onEnded = {handleEpisodeEnded}
                    autoPlay
                    loop = {isLooping}
                    onPlay = {() => setPlayingState(true)}
                    onPause = {() => setPlayingState(false)}
                    onLoadedData = {setupProgressListener}
                    />         
                    ) 
                }
                
                 <div className = {styles.buttons}> {/*botões da sidebar*/}
                    <button type = "button" disabled = {!episode || episodeList.length === 1} 
                    onClick = {toggleShuffle} className = {isShuffling ? styles.isActive : ''}>
                        <img src = "/shuffle.svg" alt = "Embaralhar"/>
                    </button>
                    {/*disabled: mantém os botões desativados quando não há podcast tocando.*/}

                    <button type = "button" onClick = {playPrevious} disabled = {!episode || !hasPrevious}>
                        <img src = "/play-previous.svg" alt = "Tocar Anterior"/>
                    </button>

                    <button className = {styles.playButton} disabled = {!episode} onClick = {togglePlay}>
                        { isPlaying ? <img src = "/pause.svg" alt = "Tocar"/> : <img src = "/play.svg" />}
                    </button>

                    <button type = "button" onClick = {playNext} disabled = {!episode || !hasNext}>
                        <img src = "/play-next.svg" alt = "Tocar Próximar"/>
                    </button>

                    <button type = "button" disabled={!episode} onClick = {toggleLoop} className = {isLooping ? styles.isActive : ''}>
                        <img src = "/repeat.svg" alt = "Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}