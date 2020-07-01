import Api from '@/services/Api';

class UserService {
    getAdminBoard() {
        return Api.get('users');
    }
    getUserBoard(userId) {
        return Api.get(`users/${userId}`);
    }

    putUser(user) {
        return Api.put(`users/${user.id}`, user);
    }

    deleteUser(userId) {
        return Api.delete(`users/${userId}`);
    }

    contratsAdmin(user) {
        console.log(user.id);
    }
}

export default new UserService();
