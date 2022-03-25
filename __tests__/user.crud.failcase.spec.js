const frisby = require('frisby');
const helper = require('../helpers/helper.js');
const user = require("../helpers/components/user");
const userData = {
    name: helper.genName(),
    email: helper.genEmail(),
    gender: 'male',
    status: 'active',
};
let userId;
let wrongUserId;

describe('Fail case tests', function () {
    beforeAll(() => {
        helper.setUpToken(helper.token)
    });

    it('POST new user', async () => {
        userId = await user.postUser(userData);
        wrongUserId = userId + 100;
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
        await frisby.post(helper.genEndpoint('users'), userData)
            .expect('status', 422)
            .expect('jsonTypes', 'data[0]', {
                field: "email",
                message: "has already been taken"
            });
    });

    it('Fail case POST user with mandatory fields missing', async () => {
        await frisby.post(helper.genEndpoint('users'), {
            id: null,
            name: null,
            email: null,
            gender: null,
            status: null
        })
            .expect('status', 422)
            .expect('jsonTypes', 'data[?]', {
                field: helper.validateString("email"),
                message: helper.validateString("can't be blank")
            })
            .expect('jsonTypes', 'data[?]', {
                field: helper.validateString("name"),
                message: helper.validateString("can't be blank")
            })
            .expect('jsonTypes', 'data[?]', {
                field: helper.validateString("gender"),
                message: helper.validateString("can't be blank")
            })
            .expect('jsonTypes', 'data[?]', {
                field: helper.validateString("status"),
                message: helper.validateString("can't be blank")
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
        await frisby.patch(`${helper.genEndpoint('users')}/${wrongUserId}`, userData)
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