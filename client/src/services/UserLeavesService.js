import Api from '@/services/Api';

class UserLeavesService {
    index(userId) {
        return Api.get(`leaves/users/${userId}/leaves`);
    }
}

export default new UserLeavesService();
