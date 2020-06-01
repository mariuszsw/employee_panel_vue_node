import Api from '@/services/Api';

export default {
    register(creds) {
        return Api.post('auth/register', creds);
    },
    loging(creds) {
        return Api.post('auth/login', creds);
    }
};
