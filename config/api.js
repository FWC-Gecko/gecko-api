const { default: axios } = require('axios');

const config = require('config');
const APIKEY = config.get('APIKEY');

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: APIKEY
  }
});

module.exports = api;
