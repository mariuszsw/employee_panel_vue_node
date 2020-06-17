import Api from '@/services/Api';

export default {
    register(creds) {
        return Api.post('auth/register', creds);
    },
    async login(creds) {
        const response = await Api.post('auth/login', creds);
        Api.defaults.headers = { 'x-access-token': response.data.token };

        return response;
    }
};
