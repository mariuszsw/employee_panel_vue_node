const faker = require('faker');
const { Contract } = require('../../models');
const { User } = require('../../models');

class contractFactory {
    static generate(props) {
        const defaultProps = {
            startDate: faker.date.future(),
            duration: 12,
            leave: 26,
            userId: props
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return Contract.build(contractFactory.generate(props));
    }

    static create(props) {
        return Contract.create(contractFactory.generate(props));
    }
}

module.exports = contractFactory;
