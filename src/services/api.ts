/* Server Side Rendering: é uma forma de consumo de dados em API, permite apresentar todos os dados de uma vez só ao client, carregando primeiramnte no lado do servido (através do 
 * node JS) e assim o conteúdo da página estará disponível para ser exibido.
 */

// Axios: biblioteca utilizada para requisicoes (= requests) http, cuida da API.

import axios from 'axios';

// Localhost 4000: json-server.
export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:4000/"
})