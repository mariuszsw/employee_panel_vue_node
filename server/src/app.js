const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('../models');

const LoginValidator = require('../validators/register');
const router = require('../routes')();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(router);

sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Your App listening on port ${port}`));
});
