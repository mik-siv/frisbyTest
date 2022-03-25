const frisby = require("frisby");
const helper = require("../helper");

class UserHelper {
    userId;

    /**
     * Creates a new user
     * @param {object} userData custom user data for the registration
     * @returns ID of the created user
     */
    postUser = async (userData) => {
        let defaultPayload = {
            id: null,
            name: helper.genName(),
            email: helper.genEmail(),
            gender: 'male',
            status: 'active',
        }
        let resultPayload = Object.assign(defaultPayload, userData)
        await frisby.post(helper.genEndpoint('users'), resultPayload)
            .expect('status', 201)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(),
                name: helper.validateString(userData.name),
                email: helper.validateString(userData.email),
                gender: helper.validateString(userData.gender),
                status: helper.validateString(userData.status)
            }).then(res => {
                this.userId = res.json.data.id;
            })
        return this.userId;
    }

    /**
     * Gets user by ID and validates its data towards baseline object
     * @param userId {string} - user ID to get
     * @param userData {object} - baseline object to compare with user data
     * @returns {Promise<void>}
     */
    getUser = async (userId, userData) => {
        await frisby.get(`${helper.genEndpoint('users')}/${userId}`)
            .expect('status', 200)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(userId),
            })
            .then(res => {
                helper.validateData(res.json.data, userData)
            })
    }
    /**
     * Patches user by ID and validates its data towards baseline object
     * @param userId {string} - user ID to patch
     * @param userData {object} - baseline object to compare with user data
     * @returns {Promise<void>}
     */
    patchUser = async (userId, userData) => {
        await frisby.patch(`${helper.genEndpoint('users')}/${userId}`, userData)
            .expect('status', 200)
            .expect('jsonTypes', 'data', {
                id: helper.validateNumber(userId),
            })
            .then(res => {
                helper.validateData(res.json.data, userData)
            })
    }
}

module.exports = new UserHelper()