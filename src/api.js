const express = require('express');
require('express-async-errors');
const loginRoute = require('./routes/loginRoute');
const userRoute = require('./routes/userRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

// ...

const app = express();

app.use(express.json());

app.use('/login', loginRoute);
app.use('/user', userRoute);

app.use(errorMiddleware);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
