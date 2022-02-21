import express from 'express';
import cors from 'cors';
import {routerUsers} from './app/routes/routes.user';
import {routerIngredients} from './app/routes/routes.ingredients';
import {routerMeals} from './app/routes/routes.meals';
import {routerRecipes} from './app/routes/routes.recipe';
import {routerPref} from './app/routes/routes.userPref';
import {routerUserData} from './app/routes/routes.userData';

// App
const app = express();

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use("/users", routerUsers);
app.use("/ingredients", routerIngredients)
app.use("/meals", routerMeals)
app.use("/recipes", routerRecipes)
app.use("/userPref", routerPref)
app.use("/userData", routerUserData)

// health check
app.get('/health', (req, res) => {
    res.send({
        health: 'OK'
    })
})

export default app;