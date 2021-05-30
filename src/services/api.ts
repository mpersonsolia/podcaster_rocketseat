// Axios: biblioteca utilizada para requisicoes (=requests) http, cuida da API.

import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:4000/"
})