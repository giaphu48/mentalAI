const express = require('express');
const app = express();
const cors = require('cors');
const port = 3025;

const clientRoutes = require('./src/routes/clientRoute');

app.use(express.json());  // Để đọc JSON body

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/clients', clientRoutes); // Gắn routes

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
