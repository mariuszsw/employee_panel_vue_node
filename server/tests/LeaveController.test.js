const HttpStatuses = require('http-status-codes');
const { sequelize } = require('../models');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const logout = require('./helpers/logout');
const truncateDatabase = require('./helpers/truncateDatabase');
const runSeeders = require('./helpers/runSeeders');

const userFactory = require('./factories/user');
const contractFactory = require('./factories/contract');
const leaveFactory = require('./factories/leave');

const app = require('../src/app');
const loginAsUser = require('./helpers/loginAsUser');

const request = require('supertest')(app);

const users = [];
const contracts = [];
const leaves = [];

let userToken;
let adminToken;

describe('LeaveController', () => {
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

        users.push(await userFactory.create());
        users.push(await userFactory.create());
        users.push(await userFactory.create());

        contracts.push(await contractFactory.create({ userId: users[0].id }));
        contracts.push(await contractFactory.create({ userId: users[1].id }));
        contracts.push(await contractFactory.create({ userId: users[2].id }));

        leaves.push(await leaveFactory.create({ userId: users[0].id }));
        leaves.push(await leaveFactory.create({ userId: users[1].id }));
        leaves.push(await leaveFactory.create({ userId: users[2].id }));
    });

    describe('POST /leaves', () => {
        it('returns CREATED when sending valid data AS ADMIN', async () => {
            const leaveData = leaveFactory.generate({ userId: users[0].id });

            const response = await request.post(`/leaves`).set('x-access-token', adminToken).send(leaveData);

            expect(response.body).toHaveProperty('start', leaveData.start);
            expect(response.statusCode).toEqual(HttpStatuses.CREATED);
        });

        it('returns CREATED when sending valid data AS ADMIN and APPROVED is equal 1', async () => {
            const leaveData = leaveFactory.generate({ approved: 1, userId: users[0].id });

            const response = await request.post(`/leaves`).set('x-access-token', adminToken).send(leaveData);

            expect(response.statusCode).toEqual(HttpStatuses.CREATED);
        });

        it('returns CREATED when sending valid data AS EMPLOYEE', async () => {
            const leaveData = leaveFactory.generate({ userId: users[0].id });

            const response = await request.post(`/leaves`).set('x-access-token', userToken).send(leaveData);

            expect(response.body).toHaveProperty('start', leaveData.start);
            expect(response.statusCode).toEqual(HttpStatuses.CREATED);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const leaveData = await leaveFactory.generate({
                start: null,
                end: null,
                approved: null,
                userId: null
            });

            const response = await request.post(`/leaves`).set('x-access-token', adminToken).send(leaveData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'start',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'end',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'approved',
                message: 'Should be Boolean'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should not be empty'
            });
            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const leaveData = await leaveFactory.generate({
                leaveDays: 'a',
                start: '11-01-2002',
                end: '2002/01.10',
                approved: 'd',
                userId: 'e'
            });

            const response = await request.post(`/leaves`).set('x-access-token', adminToken).send(leaveData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'start',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'end',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'approved',
                message: 'Should be Boolean'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should be numeric'
            });
            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns FORBIDDEN when sending valid data AS EMPLOYEE and APPROVED is equal 1', async () => {
            const leaveData = leaveFactory.generate({ approved: 1, userId: users[0].id });

            const response = await request.post(`/leaves`).set('x-access-token', userToken).send(leaveData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when sending valid data WITHOUT TOKEN', async () => {
            const leaveData = leaveFactory.generate();

            const response = await request.post(`/leaves`).send(leaveData);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('PUT /leaves/:id', () => {
        it('returns OK when put a single leave AS ADMIN', async () => {
            const leave = await contractFactory.generate({
                start: '2020-01-01',
                end: '2020-01-11',
                approved: 0,
                userId: users[0].id
            });

            const response = await request.put(`/leaves/${leaves[0].id}`).set('x-access-token', adminToken).send(leave);

            expect(response.body.start).toEqual(leave.start);
            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns OK when put a single leave AS EMPLOYE', async () => {
            const leaveData = await contractFactory.generate({
                start: '2022-01-01',
                end: '2022-01-11',
                approved: 0,
                userId: users[0].id
            });

            const response = await request
                .put(`/leaves/${leaves[0].id}`)
                .set('x-access-token', userToken)
                .send(leaveData);

            expect(response.body.start).toEqual(leaveData.start);
            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const leave = await leaveFactory.generate({
                leaveDays: null,
                start: null,
                end: null,
                approved: null,
                userId: null
            });
            const response = await request.put(`/leaves/${leaves[0].id}`).set('x-access-token', adminToken).send(leave);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'start',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'end',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'approved',
                message: 'Should be Boolean'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should not be empty'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const leave = await leaveFactory.generate({
                start: 'b',
                end: 'c',
                approved: 'd',
                userId: 'e'
            });

            const response = await request.put(`/leaves/${leaves[0].id}`).set('x-access-token', adminToken).send(leave);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'start',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'end',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'approved',
                message: 'Should be Boolean'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should be numeric'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns UNAUTHORIZED when put a single leave WITHOUT TOKEN', async () => {
            const leave = await leaveFactory.generate();

            const response = await request.put(`/leaves/${leaves[0].id}`).send(leave);

            expect(response.body).toMatchObject({
                message: 'No token provided!'
            });

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('DELETE /leaves/:id', () => {
        it('returns NO_CONTENT when delete a single leave AS ADMIN', async () => {
            const response = await request.delete(`/leaves/${leaves[0].id}`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns NO_CONTENT when delete a single leave AS EMPLOYEE', async () => {
            const response = await request.delete(`/leaves/${leaves[0].id}`).set('x-access-token', userToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns NO_CONTENT when delete not existed single contract AS ADMIN', async () => {
            const response = await request.delete(`/leaves/99999999999999`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns UNAUTHORIZED when delete a single leave WITHOUT TOKEN', async () => {
            const response = await request.delete(`/leaves/${leaves[0].id}`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });
});
