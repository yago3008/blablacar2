const express = require('express');
const syncDatabase = require('./config/syncDatabase');
const app = express();
app.use(express.json());
const userRoute = require('./routes/userRoute');
const cors = require('cors');

app
    .use(cors({origin: '*'}))
    .use('/user', userRoute);
    
syncDatabase();

app.listen(3000, () => {
    console.log('Server runnin on http://localhost:3000');
});
