const { User, Role } = require('../../models');

module.exports = async () => {
    const adminRole = await Role.create({ name: 'admin' });
    const userRole = await Role.create({ name: 'user' });

    const adminUser = await User.create({
        name: 'admin',
        surname: 'admin',
        email: 'admin@system.test',
        password: 'password',
        birthdate: '1990-01-01'
    });
    await adminUser.addRole(adminRole);

    const user = await User.create({
        name: 'user',
        surname: 'user',
        email: 'user@system.test',
        password: 'password',
        birthdate: '1990-01-01'
    });
    await user.addRole(userRole);
};
