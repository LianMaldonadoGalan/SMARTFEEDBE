import app from './server';

// Constants
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`);
});