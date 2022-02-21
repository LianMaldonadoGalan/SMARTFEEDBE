import express from "express";

import { getUserPrefController, updateUserPrefController } from "../controllers/controller.userPref";

export const routerPref = express.Router();

routerPref.get("/:id_user", getUserPrefController);

routerPref.patch("/:id_user", updateUserPrefController);