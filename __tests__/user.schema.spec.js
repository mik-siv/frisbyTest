const frisby = require('frisby');
const helper = require('../helpers/helper.js');
const Joi = frisby.Joi;
let pagesCount;
let defaultPageNum = 1;
let pageLimit = 20;

describe('User endpoint schema checks', () => {

    it('Get schema meta data', async () => {
        await frisby.get(helper.genEndpoint('users'))
            .expect('status', 200)
            .expect('jsonTypes', 'meta', {
                pagination: helper.validateObject({
                    total: helper.validateNumber(),
                    pages: helper.validateNumber(),
                    page: helper.validateNumber(defaultPageNum),
                    limit: helper.validateNumber(pageLimit),
                    links: helper.validateObject({
                        previous: Joi.valid(null),
                        current: helper.validateString(`${helper.genEndpoint('users')}?page=${defaultPageNum}`),
                        next: helper.validateString(`${helper.genEndpoint('users')}?page=${defaultPageNum + 1}`),
                    })
                }),
            })
            .then(res => {
                pagesCount = res.json.meta.pages;
            })
    });

    it('Validate user schema', async () => {
        for (let i = 1; i <= pagesCount; i++) {
        await frisby.get(`${helper.genEndpoint('users')}?page=${i}`)
            .expect('status', 200)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(),
                name: helper.validateString(),
                email: helper.validateString(),
                gender: helper.validateString(),
                status: helper.validateString()
            })
        }
    });

});


