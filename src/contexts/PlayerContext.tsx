import { createContext, useState, ReactNode, useContext } from 'react'; // importação de hooks do React

// tipagem
type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

// tipagem
type PlayerContext = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;        
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    clearPlayerState: () => void
};

// Context API: utilizado quando há a necessidade de trabalhar com os dados de maneira globais.
//      - createContext: inicialização do Context API - usa a os dados da tipagem do PlayerContext acima.
export const PlayerContext = createContext({} as PlayerContext);

// tipagem
// ReactNode:
type PlayerContextProviderProps = {
    children: ReactNode;
}

// useState: determina o valor inicial do slider.
//    - false: 
export function PlayerContextProvider( { children } : PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index:number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(){
        setIsLooping(!isLooping);
    }

    function toggleShuffle(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasPrevious= currentEpisodeIndex > 0
    const hasNext= isShuffling || (currentEpisodeIndex + 1 ) < episodeList.length

    function playNext(){
        if (isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1 )}         
    }

    function playPrevious(){
       if(hasPrevious){
           setCurrentEpisodeIndex(currentEpisodeIndex - 1)
       }
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider value ={ { episodeList,
         currentEpisodeIndex,
         play,
         playList,
         isPlaying,
         playNext,
         playPrevious,
         togglePlay,
         hasNext,
         hasPrevious,
         isLooping,
         toggleLoop,
         toggleShuffle,
         isShuffling,
         clearPlayerState,
         setPlayingState }}>
        {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}