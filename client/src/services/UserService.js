import Api from '@/services/Api';

class UserService {
    getAdminBoard() {
        return Api.get('auth/admin');
    }
}

export default new UserService();
