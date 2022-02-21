import express from "express";

import { getUserDataController, updateUserDataController } from "../controllers/controller.userData";

export const routerUserData = express.Router();

routerUserData.get("/:id_user", getUserDataController);

routerUserData.patch("/:id_user", updateUserDataController);