const { sequelize } = require('../models');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const logout = require('./helpers/logout');
const truncateDatabase = require('./helpers/truncateDatabase');
const runSeeders = require('./helpers/runSeeders');
const HttpStatuses = require('http-status-codes');

const UserFactory = require('./factories/user');

const app = require('../src/app');
const loginAsUser = require('./helpers/loginAsUser');

const request = require('supertest')(app);

const users = [];

let userToken;
let adminToken;

describe('UserController', () => {
    afterAll(async () => {
        await logout(request);
        await sequelize.close();
    });

    beforeAll(async () => {
        await truncateDatabase();
        await runSeeders();

        const userResponse = await loginAsUser(request);
        const adminResponse = await loginAsAdmin(request);

        userToken = userResponse.body.token;
        adminToken = adminResponse.body.token;

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
    });

    describe('GET ALL /users', () => {
        it('returns OK fetching users as ADMIN', async () => {
            const response = await request.get(`/users`).set('x-access-token', adminToken);

            expect(Object.keys(response.body).length).toEqual(5);

            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('return FORBIDDEN trying fetch users AS EMPLOYEE', async () => {
            const response = await request.get(`/users`).set('x-access-token', userToken);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('return UNAUTHORIZED trying fetch users WITHOUT TOKEN', async () => {
            const response = await request.get(`/users`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('GET /users/{id}', () => {
        it('returns OK fetching a single user AS ADMIN', async () => {
            const response = await request.get(`/users/${users[0].id}`).set('x-access-token', adminToken);

            expect(response.body).toHaveProperty('email');
            expect(response.body.email).toEqual(users[0].email);
            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns NOT_FOUND fetching not existed id AS ADMIN', async () => {
            const response = await request.get(`/users/99999999`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NOT_FOUND);
        });

        it('return FORBIDDEN trying fetch a single user AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();

            const response = await request.get(`/users/${users[0].id}`).set('x-access-token', userToken).send(userData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED fetching a single user WITHOUT TOKEN', async () => {
            const response = await request.get(`/users/${users[0].id}`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('POST /users', () => {
        it('returns CREATED when sending valid data AS ADMIN', async () => {
            const userData = UserFactory.generate();

            const response = await request.post(`/users`).set('x-access-token', adminToken).send(userData);

            expect(response.body).toHaveProperty('name', userData.name);
            expect(response.statusCode).toEqual(HttpStatuses.CREATED);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const userData = await UserFactory.generate({ name: null, surname: null, email: null, password: null });
            const response = await request.post(`/users`).set('x-access-token', adminToken).send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'name',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'surname',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'password',
                message: 'Should not be empty'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending already existed email AS ADMIN', async () => {
            await UserFactory.create({ email: `me@me123.com` });
            const userData = await UserFactory.generate({ email: `me@me123.com` });

            const response = await request.post(`/users`).set('x-access-token', adminToken).send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Email address already exists!'
            });
            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const userData = await UserFactory.generate({
                name: 'a',
                surname: 'b',
                email: 'definitelyNotAnEmail',
                password: 12345
            });

            const response = await request.post(`/users`).set('x-access-token', adminToken).send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'password',
                message: 'Password must be 6-32 characters in length'
            });
            expect(response.body.errors).toContainEqual({
                param: 'name',
                message: 'Name must have more than 2 characters'
            });
            expect(response.body.errors).toContainEqual({
                param: 'surname',
                message: 'Surname must have more than 2 characters'
            });
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Email address is not valid!'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns FORBIDDEN when sending valid data AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();

            const response = await request.post(`/users`).set('x-access-token', userToken).send(userData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when sending valid data WITHOUT TOKEN', async () => {
            const userData = UserFactory.generate();

            const response = await request.post(`/users`).send(userData);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('PUT /users/{id}', () => {
        it('returns OK when put a single user AS ADMIN', async () => {
            const userData = await UserFactory.generate({ email: `test999@me.com` });

            const response = await request
                .put(`/users/${users[0].id}`)
                .set('x-access-token', adminToken)
                .send(userData);

            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const userData = await UserFactory.generate({ name: null, surname: null, email: null, password: null });
            const response = await request
                .put(`/users/${users[0].id}`)
                .set('x-access-token', adminToken)
                .send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'name',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'surname',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'password',
                message: 'Should not be empty'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending already existed email AS ADMIN', async () => {
            await UserFactory.create({ email: `me@me1234.com` });
            const userData = await UserFactory.generate({ email: `me@me1234.com` });

            const response = await request
                .put(`/users/${users[0].id}`)
                .set('x-access-token', adminToken)
                .send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Email address already exists!'
            });
            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const userData = await UserFactory.generate({
                name: 'a',
                surname: 'b',
                email: 'definitelyNotAnEmail',
                password: 12345
            });

            const response = await request
                .put(`/users/${users[0].id}`)
                .set('x-access-token', adminToken)
                .send(userData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'password',
                message: 'Password must be 6-32 characters in length'
            });
            expect(response.body.errors).toContainEqual({
                param: 'name',
                message: 'Name must have more than 2 characters'
            });
            expect(response.body.errors).toContainEqual({
                param: 'surname',
                message: 'Surname must have more than 2 characters'
            });
            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Email address is not valid!'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns FORBIDDEN when put a single user AS EMPLOYEE', async () => {
            const userData = await UserFactory.generate();

            const response = await request.put(`/users/${users[0].id}`).set('x-access-token', userToken).send(userData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when put a single user WITHOUT TOKEN', async () => {
            const userData = await UserFactory.generate();

            const response = await request.put(`/users/${users[0].id}`).send(userData);

            expect(response.body).toMatchObject({
                message: 'No token provided!'
            });

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('DELETE /users/{id}', () => {
        it('returns NO_CONTENT when delete not existed single user AS ADMIN', async () => {
            const response = await request.delete(`/users/99999999`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns NO_CONTENT when delete a single user AS ADMIN', async () => {
            const response = await request.delete(`/users/${users[0].id}`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns FORBIDDEN when delete a single user AS EMPLOYEE', async () => {
            const response = await request.delete(`/users/${users[0].id}`).set('x-access-token', userToken);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when delete a single user WITHOUT TOKEN', async () => {
            const response = await request.delete(`/users/${users[0].id}`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });
});
