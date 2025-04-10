const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportsRouter = require('./routes/reports');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const filesRouter = require('./routes/files');
const authMiddleware = require('./authMiddleware');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shadowReport', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/files', filesRouter);
app.use('/api/reports', authMiddleware, reportsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});