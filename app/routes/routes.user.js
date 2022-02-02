import express from 'express';

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

