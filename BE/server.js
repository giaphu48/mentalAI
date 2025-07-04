const express = require('express');
const app = express();
const cors = require('cors');
const port = 3025;
const cookieParser = require('cookie-parser');
const clientRoutes = require('./src/routes/clientRoute');
const expertRoutes = require('./src/routes/expertRoute');
const userRoutes = require('./src/routes/userRoute')

app.use(express.json());  // Để đọc JSON body
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/clients', clientRoutes); // Gắn routes
app.use('/experts', expertRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
