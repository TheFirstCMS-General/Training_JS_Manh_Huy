const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Sử dụng middleware cors
app.use(cors());

// Cài đặt middleware để parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const studentRoutes = require('./routes/student');
app.use('/student', studentRoutes);

const feeRoutes = require('./routes/fee');
app.use('/fee', feeRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
