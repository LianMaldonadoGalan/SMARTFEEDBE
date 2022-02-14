import app from './server';

// Constants
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`);
});