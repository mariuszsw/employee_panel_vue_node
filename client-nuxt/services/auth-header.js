export default function authHeader($auth) {
    let user;
    let token;

    if (process.server) {
        return;
    }

    user = JSON.parse(localStorage.getItem('user'));

    token = localStorage.getItem('token');

    if (user && token) {
        return { 'x-access-token': token };
    } else {
        return {};
    }
}
