import Api from '@/services/Api';

class UserContractsService {
    index(userId) {
        return Api.get(`/users/${userId}/contracts`);
    }
}

export default new UserContractsService();
