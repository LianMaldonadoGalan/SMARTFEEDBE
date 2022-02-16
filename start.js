import app from './server';

// Constants
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`);
});