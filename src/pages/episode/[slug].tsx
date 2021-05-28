import { parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns';
import { api } from '../../services/api';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss'

import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';

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

type EpisodeProps = {
    episode: Episode
};

export default function Episode({episode}: EpisodeProps){
    const { play  } = usePlayer()  
    
    return(
        <div className={styles.episode}>
            <Head>
            <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar"/>
                </button>

                </Link>
                <Image 
                width={700}
                height={160}
                src={episode.thumbnail}
                objectFit="cover"/>

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>
            
            <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
            </header>
            <div 
            className={styles.description}
            dangerouslySetInnerHTML={{__html:episode.description}}
            />              
        </div>        
    )
}

/* Get Static Paths: indica quais episódios serão gerados de forma estática no momento da build.
 * como o 'paths' está vazio, significa que nenhum episódio será gerado nesse momento.
 *
 * fallback: (incremental static regenaration) determina o comportamento da página que não foi gerada 
 * estaticamente.
 *       - false: retorna 404 e seria disponível apenas os episódios indicados no path.
 *       - true: tenta buscar o novo episódio, através do front-end, que não foi gerada de forma estática. 
 *       - blocking: a requisição de dados ocorre através do node js, o client só é enviado para a tela quando
 *         todos os dados já foram carregados.
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit:2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
            slug: episode.id}
        }
    })

    return{
        paths,
        fallback:'blocking'
    }
}

/* SSG: a página dinâmica é gerada de forma estática quando usado o GetStaticProps.
   O slug do episódio é uma opção dinâmica, pois não tem como saber qual episódio será selecionado.
 */

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)
    
    const episode =  {        
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
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,
    }
}