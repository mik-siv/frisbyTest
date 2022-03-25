const frisby = require('frisby');
const helper = require('../helpers/helper.js');
const user = require('../helpers/components/user.js')
const userData = {
    name: helper.genName(),
    email: helper.genEmail(),
    gender: 'male',
    status: 'active',
};
let userId;


describe('User CRUD', () => {
    beforeAll(() => {
        helper.setUpToken(helper.token)
    });


    it('POST new user', async () => {
        userId = await user.postUser(userData);
    });

    it('GET created user', async () => {
        await user.getUser(userId, userData);
    });

    it('PATCH existing user', async () => {
        userData.name = helper.genName();
        userData.email = helper.genEmail();
        userData.gender = 'female';
        userData.status = 'inactive';

        await user.patchUser(userId, userData)
    });

    it('DELETE existing user', async () => {
        await frisby.delete(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 204)
    });

    it('GET deleted user', async () => {
        await frisby.get(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 404)
    });

    it('PATCH deleted user', async () => {
        await frisby.patch(`${helper.genEndpoint('users')}/${userId}`, userData)
            .expect('status', 404)
    });
});


