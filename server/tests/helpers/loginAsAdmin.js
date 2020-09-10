module.exports = async (request) => {
     const credentials = {
        email: 'admin@system.test',
        password: 'password'
    };

    return await request
        .post('/auth/login')
        .send(credentials);
};
