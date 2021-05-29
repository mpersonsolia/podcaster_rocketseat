import { GetStaticProps } from 'next'; //indica os dados estáticos
import Image from 'next/image'; //permite adicionar propriedades em imagens salvas fora do projeto
import Head from 'next/head'; //link para a tag head de outro arquivo
import { api } from '../services/api'; // impede que a API seja indexada nos buscadores
import { format, parseISO} from 'date-fns'; // extensão para datas
import ptBR from 'date-fns/locale/pt-BR'; // extensão para datas com localidade
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import Link from 'next/link'; // permite que o link seja encaminhado para outro arquivo do próprio projeto
import { usePlayer } from '../contexts/PlayerContext';

// tipagem feita com o TypeScript

type Episodes = {  
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration:number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episodes[],
  allEpisodes: Episodes[]    
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { playList } = usePlayer()
  const episodeList = [...latestEpisodes, ...allEpisodes]  
  
  return (
    <div className={styles.homepage}> {/*estilização da homepage*/}
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}> {/*estilização dos dois últimos episódios lançados*/}
        <h2>
          Últimos lançamentos
        </h2>
        <ul>
          
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}> {/*key: utiliza informação singular da propriedade para evitar tags duplicadas*/} 
                <Image 
                width ={192} 
                height={192} 
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
                />

                <div className={styles.episodeDetails}> {/*estilização dos detalhes do episódio*/} 
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={ () => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{width: 100}}>
                    <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                    />
                  </td>

                  <td>
                    <Link href={`/episode/${episode.id}`}>
                    <a >{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {  
  const { data } = await  api.get('episodes', {
    params: {
      _limit:12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration:Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0,2); /*apresentação apenas dos dois últimos episódios lançados*/
  const allEpisodes = episodes.slice (2, episodes.length) /*apresentação de todos os episódios, as partir do segundo*/ 
  
   return {
     props: {
      latestEpisodes,
      allEpisodes,
     },
     revalidate: 60 * 60 * 8 /*revalidate: propriedade do GetStaticProps - tempo em que a página estática será atualizada*/
   }
  }
