import Api from '@/services/Api';

class UserService {
    index() {
        return Api.get(`/users`);
    }

    delete(userId) {
        return Api.delete(`/users/${userId}`);
    }

    save(user) {
        if (user.id) {
            return Api.put(`/users/${user.id}`, user);
        } else {
            return Api.post('/users', user);
        }
    }
}

export default new UserService();
