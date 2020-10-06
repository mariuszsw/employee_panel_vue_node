const faker = require('faker');
const { Leave } = require('../../models');
const { User } = require('../../models');

class leaveFactory {
    static generate(props) {
        const defaultProps = {
            leaveDays: 20,
            start: '2020-01-01',
            end: '2020-02-02',
            approved: 0,
            userId: 0
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return Leave.build(leaveFactory.generate(props));
    }

    static create(props) {
        return Leave.create(leaveFactory.generate(props));
    }
}

module.exports = leaveFactory;
