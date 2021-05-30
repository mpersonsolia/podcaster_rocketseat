import { GetStaticPaths, GetStaticProps } from 'next'; // importacao das funcoes da biblioteca do next

import Head from 'next/head'; // link para a tag head de outro arquivo
import Link from 'next/link'; // permite que o link seja encaminhado para outro arquivo do próprio projeto
import Image from 'next/image'; // permite adicionar propriedades em imagens salvas fora do projeto

import { parseISO } from 'date-fns';  // extensao para datas, que forma uma string em data
import { format } from 'date-fns'; // extensão para datas
import { ptBR } from 'date-fns/locale'; // extensão para datas com localidade

import { api } from '../../services/api'; //importacao da funcao de outro arquivo do projeto
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'; //importacao da funcao de outro arquivo do projeto
import styles from './episode.module.scss'; // estilizacao

import { PlayerContext, usePlayer } from '../../contexts/PlayerContext'; //importacao da funcao de outro arquivo do projeto

// tipagem feita com o TypeScript
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

// tipagem feita com o TypeScript
type EpisodeProps = {
    episode: Episode
};

// fuction Episode: cuida da pagina dos episodios.
export default function Episode({episode}: EpisodeProps){
    const { play } = usePlayer()  
    
    return(
        <div className = {styles.episode}>
            <Head>
            <title>{episode.title} | Podcastr</title> {/*titulo na guia*/}
            </Head>
            <div className = {styles.thumbnailContainer}> {/*imagem da pagina do podcast*/}
                <Link href = "/">
                <button type = "button">
                    <img src = "/arrow-left.svg" alt="Voltar"/> {/*seta de voltar da pagina do podcast*/}
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
            dangerouslySetInnerHTML = {{__html:episode.description}} // indica a periculosidade de adicionar um endereco html no codigo
            />              
        </div>        
    )
}

/* Get Static Paths: indica quais episódios serão gerados de forma estática no momento da build.
 *     - como o 'paths' está vazio, significa que nenhum episódio será gerado nesse momento.
 *
 * fallback: (incremental static regenaration) determina o comportamento da página que não foi gerada 
 * estaticamente.
 *     - false: retorna 404 e seria disponível apenas os episódios indicados no path.
 *     - true: tenta buscar o novo episódio, através do front-end, que não foi gerada de forma estática. 
 *     - blocking: a requisição de dados ocorre através do node js, o client só é enviado para a tela quando
 *       todos os dados já foram carregados.
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2, // limite de dois podcasts na pagina.
            _sort: 'published_at', // apresentado por ordem de publicacao
            _order: 'desc' // de forma decrescente
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
            slug: episode.id}
        }
    })

    return{
        paths, //
        fallback:'blocking' // requisição de dados ocorre através do node js, o client só é enviado para a tela quando todos os dados já foram carregados.
    }
}

/* SSG: a página dinâmica é gerada de forma estática quando usado o GetStaticProps
 * GetStaticProps: produz os dados da API durante a produção, de forma a permitir observar como o projeto atua fora do localhost
     ctx:
 */

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
        props: { // props: objetos opcionais
            episode
        },
        revalidate: 60 * 60 * 24, // revalidate: propriedade do GetStaticProps - tempo em que a página estática será atualizada
    }
}