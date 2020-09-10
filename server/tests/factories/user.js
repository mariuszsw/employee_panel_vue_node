const faker = require('faker');
const { User } = require('../../models');

class UserFactory {
    static generate(props) {
        const defaultProps = {
            email: faker.internet.email(),
            name: faker.name.firstName(null),
            surname: faker.name.lastName(null),
            password: faker.internet.password(),
            birthdate: faker.date.past(20)
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return User.build(UserFactory.generate(props));
    }

    static create(props) {
        return User.create(UserFactory.generate(props));
    }
}

module.exports = UserFactory;
