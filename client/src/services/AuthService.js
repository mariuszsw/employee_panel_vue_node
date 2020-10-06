import Api from '@/services/Api';

export default {
    async login(creds) {
        const response = await Api.post('/auth/login', creds);
        Api.defaults.headers = { 'x-access-token': response.data.token };

        return response;
    }
};
