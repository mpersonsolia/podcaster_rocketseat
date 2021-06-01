import { GetStaticPaths, GetStaticProps } from 'next'; // importação de funções do Next

import Head from 'next/head'; // importação de funções do Next
import Link from 'next/link'; // importação de funções do Next
import Image from 'next/image'; // importação de funções do Next

import { parseISO } from 'date-fns';  // extensão para data
import { format } from 'date-fns'; // extensão para datas
import { ptBR } from 'date-fns/locale'; // extensão para data com localidade brasileira

import { api } from '../../services/api'; // importação de função de outro arquivo do projeto
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'; // importação de função de outro arquivo do projeto
import styles from './episode.module.scss'; // estilização específica

import { PlayerContext, usePlayer } from '../../contexts/PlayerContext'; // importação de função de outro arquivo do projeto

// tipagem 
type Episode = {  
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration:number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

// tipagem 
type EpisodeProps = {
    episode: Episode
};

// Episode: função 
export default function Episode({episode}: EpisodeProps){
    const { play } = usePlayer()  
    
    return(
        <div className = {styles.episode}>
            <Head>
            <title>{episode.title} | Podcastr</title> {/*título na aba do brownser*/}
            </Head>
            <div className = {styles.thumbnailContainer}> {/*estilo das páginas dos podcasts*/}
                <Link href = "/">
                <button type = "button">
                    <img src = "/arrow-left.svg" alt="Voltar"/> 
                </button>
                </Link>
                
                <Image 
                width = {700}
                height = {160}
                src = {episode.thumbnail}
                objectFit = "cover"/>

                <button type = "button" onClick = {() => play(episode)}>
                    <img src = "/play.svg" alt = "Tocar o Episódio"/>
                </button>
            </div>
            
            <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
            </header>
            <div 
            className = {styles.description}
            dangerouslySetInnerHTML = {{__html:episode.description}} // tag para adicionar html ao código
            />              
        </div>        
    )
}

// GetStaticPaths: indica quais episódios serão gerados de forma estática no momento da build.
//   - como o 'paths' está vazio, significa que nenhum episódio será gerado nesse momento.

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2, // limite de dois podcasts em 'Últimos Lançamentos'
            _sort: 'published_at', // apresentado por ordem de publicação
            _order: 'desc' // de forma decrescente
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
            slug: episode.id}
        }
    })

    /* fallback: determina o comportamento da página que não foi gerada estaticamente.
    *     - false: retorna 404 e seria disponível apenas os episódios indicados no path.
    *     - true: tenta buscar o novo episódio, através do front-end, que não foi gerada de forma estática. 
    *     - blocking: a requisição de dados ocorre através do node js, o client só é enviado para a tela quando todos os dados já foram carregados.
    */
    return{
        paths, //
        fallback:'blocking'
    }
}

// GetStaticProps: produz os dados da API durante a produção, de forma a permitir observar como o projeto atua fora do localhost.
//   - ctx: 
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)
    
    const episode = {        
          id: data.id,
          title: data.title,
          thumbnail: data.thumbnail,
          members: data.members,
          publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
          duration:Number(data.file.duration),
          durationAsString: convertDurationToTimeString(Number(data.file.duration)),
          description: data.description,
          url: data.file.url,        
      }

    return {
        props: { // props: objetos opcionais.
            episode
        },
        revalidate: 60 * 60 * 24, // revalidate: propriedade do GetStaticProps - lapso temporal na qual a página será atualizada.
    }
}