const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/users-controllers");
const userValidation = require("../../middlewares/validation/signup-validation");
const loginValidation = require("../../middlewares/validation/login-validation");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

router.post("/signup", userValidation, ctrl.signUp);

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/verify");

router.post("/login", loginValidation, ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
