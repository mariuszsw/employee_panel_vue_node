import axios from 'axios';
import authHeader from './auth-header';

const instance = axios.create({
    baseURL: `http://localhost:3000`
});
instance.defaults.headers = authHeader();

export default instance;
