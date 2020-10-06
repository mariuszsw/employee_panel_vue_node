import Api from '@/services/Api';

class UserLeavesService {
    index(userId) {
        return Api.get(`/users/${userId}/leaves`);
    }
}

export default new UserLeavesService();
