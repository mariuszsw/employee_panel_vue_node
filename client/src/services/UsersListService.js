import Api from '@/services/Api';

class UsersListService {
    index() {
        return Api.get(`users`);
    }
}

export default new UsersListService();
