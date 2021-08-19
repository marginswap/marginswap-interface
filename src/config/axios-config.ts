import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_COINGECKO_API
})

// Where you would set stuff like your 'Authorization' header, etc ...
//instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// if we need to add/configure interceptors && all the other cool stuff
//instance.interceptors.request...

export default instance
