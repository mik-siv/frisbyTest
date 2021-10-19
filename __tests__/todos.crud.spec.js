const frisby = require('frisby');
const helper = require('../helpers/helper.js');

let payload = {
    id: null,
    user_id: 2,
    title: "Hello World",
    due_on: "2021-11-05T00:00:00.000+05:30",
    status: "completed"
}

describe('todos crud', function () {
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

    it('Create a new todo', async () => {
        await frisby.post(helper.genEndpoint('todos'), payload)
            .inspectResponse()
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(),
                user_id: helper.validateString(payload.user_id),
                title: helper.validateString(payload.title),
                due_on: helper.validateString(payload.due_on),
                status: helper.validateString(payload.status)
            })
    })
})