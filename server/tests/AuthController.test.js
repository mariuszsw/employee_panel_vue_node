const { sequelize } = require('../models');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const logout = require('./helpers/logout');
const truncateDatabase = require('./helpers/truncateDatabase');
const runSeeders = require('./helpers/runSeeders');

const UserFactory = require('./factories/user');
const HttpStatuses = require('http-status-codes');

const app = require('../src/app');
const { system } = require('faker');
const request = require('supertest')(app);
const users = [];
let token;

afterAll(async () => {
    await logout(request);
    await sequelize.close();
});

describe('AuthController', () => {
    beforeAll(async () => {
        await truncateDatabase();
        await runSeeders();

        const response = await loginAsAdmin(request);
        token = response.body.token;

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
    });

    describe('POST /auth/login', () => {
        it('return OK if email and password is correct', async (done) => {
            const credentials = { email: 'admin@system.test', password: 'password' };

            const response = await request.post(`/auth/login`).send(credentials);

            expect(response.body.user).toMatchObject({ email: 'admin@system.test' });

            expect(response.statusCode).toEqual(HttpStatuses.OK);

            done();
        });

        it('returns BAD_REQUEST sending invalid data(blank)', async (done) => {
            const credentials = { email: null, password: null };

            const response = await request.post(`/auth/login`).send(credentials);

            expect(response.body.errors).toContainEqual({
                param: 'email',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'password',
                message: 'Should not be empty'
            });
            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);

            done();
        });

        it('return UNAUTHORIZED if password is incorrect', async (done) => {
            const credentials = { email: 'admin@system.test', password: 'password1' };

            const response = await request.post(`/auth/login`).send(credentials);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);

            done();
        });

        it('return UNAUTHORIZED if email is incorrect', async (done) => {
            const credentials = { email: 'incorrentMail@system.test', password: '1234567' };

            const response = await request.post(`/auth/login`).send(credentials);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);

            done();
        });
    });
});
