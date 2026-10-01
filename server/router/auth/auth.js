import express from "express";
import {
  loginController,
  signUpController,
  updateAddressController,
} from "../../controllers/auth/auth.js";
import { requireToken } from "../../middleware/require-token.js";

const router = express.Router();

router.post("/login", loginController);

router.post("/sign-up", signUpController);

router.put("/address", requireToken, updateAddressController);

export default router;
