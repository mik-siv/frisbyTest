const frisby = require('frisby');
const helper = require('../helpers/helper.js');
const userData = {
    name: helper.genName(),
    email: helper.genEmail(),
    gender: 'male',
    status: 'active',
};
let userId;
let wrongUserId;

describe('Fail case tests', function () {
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
                wrongUserId = userId + 100;
            });
    });

    it('Fail case POST user with wrong email format', async () => {
        await frisby.post(helper.genEndpoint('users'), {
            id: null,
            name: userData.name,
            email: '123',
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 422)
            .expect('jsonTypes', 'data[0]', {
                field: helper.validateString("email"),
                message: helper.validateString("is invalid")
            });
    });

    it('Fail case POST duplicate user', async () => {
        await frisby.post(helper.genEndpoint('users'), {
            id: null,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 422)
            .expect('jsonTypes', 'data[0]', {
                field: "email",
                message: "has already been taken"
            });
    });

    it('Fail case POST user with mandatory fields missing', async () => {
        await frisby.post(helper.genEndpoint('users'), {
            id: null,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 422)
            .expect('jsonTypes', 'data[0]', {
                field: helper.validateString("email"),
                message: helper.validateString("has already been taken")
            });
    });

    it('Fail case GET non-existing user', async () => {
        await frisby.get(`${helper.genEndpoint('users')}/${wrongUserId}`)
            .expect('status', 404)
            .expect('jsonTypes', 'data', {
                message: helper.validateString("Resource not found")
            });
    });

    it('Fail case PATCH non-existing user', async () => {
        await frisby.patch(`${helper.genEndpoint('users')}/${wrongUserId}`, {
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            status: userData.status
        })
            .expect('status', 404)
            .expect('jsonTypes', 'data', {
                message: helper.validateString("Resource not found"),
            });
    });

    it('Fail case DELETE non-existing user', async () => {
        await frisby.delete(`${helper.genEndpoint('users')}/${wrongUserId}`)
            .expect('status', 404)
            .expect('jsonTypes', 'data', {
                message: helper.validateString("Resource not found"),
            });
    });
})