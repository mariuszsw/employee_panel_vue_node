import Api from '@/services/Api';

class UserService {
    getAdminBoard() {
        return Api.get('users');
    }
    getUserBoard(userId) {
        return Api.get(`users/${userId}`);
    }

    delete(userId) {
        return Api.delete(`users/${userId}`);
    }

    save(user) {
        if (user.id) {
            return Api.put(`users/${user.id}`, user);
        }
        // else {
        //     return Api.post(`user`, user);
        // }
    }
}

export default new UserService();
