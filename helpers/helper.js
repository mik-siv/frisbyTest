const faker = require('faker');
const frisby = require('frisby');
const Joi = frisby.Joi;

class helper {

    #token = '4c0639b1709407fbc215081b15f0df4ca1c3d292872b350c3753f512f9ca0a21';
    apiUrl = 'https://gorest.co.in/public/v1/';

    sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    get token() {
        return this.#token;
    };

    genEndpoint(service) {
        return `${this.apiUrl}${service}`
    }

    genName() {
        let name = faker.name.findName();
        console.log(`Generated user name: ${name}`);
        return name;
    }

    genEmail() {
        let email = faker.internet.email();
        console.log(`Generated user email: ${email}`);
        return email;
    }

    validateString(string) {
        if (string) {
            return Joi.string().required().valid(string)
        } else {
            return Joi.string().required()
        }
    }

    validateNumber(number) {
        if (number) {
            return Joi.number().required().valid(number)
        } else {
            return Joi.number().required()
        }
    }

    validateObject(obj) {
        if (obj) {
            return Joi.object(obj).required()
        } else {
            return Joi.object().required()
        }
    }
}

module.exports = new helper();