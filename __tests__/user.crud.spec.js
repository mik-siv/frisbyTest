const frisby = require('frisby');
const helper = require('../helpers/helper.js');
const userData = {
    name: helper.genName(),
    email: helper.genEmail(),
    gender: 'male',
    status: 'active',
};
let userId;


describe('User CRUD', () => {
    beforeAll(
        () => {
            frisby.globalSetup({
                request: {
                    headers: {
                        'Authorization': 'Bearer ' + helper.token,
                        'Content-Type': 'application/json',
                    }
                }
            })
        }
    );


    it('POST new user', async () => {
        await frisby.post(helper.genEndpoint('users'), {
            id: null,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 201)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(),
                name: helper.validateString(userData.name),
                email: helper.validateString(userData.email),
                gender: helper.validateString(userData.gender),
                status: helper.validateString(userData.status)
            }).then(res => {
                userId = res.json.data.id;
            })
    });

    it('GET created user', async () => {
        await frisby.get(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 200)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(userId),
                name: helper.validateString(userData.name),
                email: helper.validateString(userData.email),
                gender: helper.validateString(userData.gender),
                status: helper.validateString(userData.status)
            })
    });

    it('PATCH existing user', async () => {
        userData.name = helper.genName();
        userData.email = helper.genEmail();
        userData.gender = 'female';
        userData.status = 'inactive';

        await frisby.patch(`${helper.genEndpoint('users')}/${userId}`, {
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 200)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(),
                name: helper.validateString(userData.name),
                email: helper.validateString(userData.email),
                gender: helper.validateString(userData.gender),
                status: helper.validateString(userData.status)
            })
    });

    it('DELETE existing user', async () => {
        await frisby.delete(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 204)
    });

    it('GET deleted user', async () => {
        await frisby.get(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 404)
    });
});


