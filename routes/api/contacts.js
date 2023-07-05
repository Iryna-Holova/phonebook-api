const express = require("express");

const router = express.Router();

const {
  ctrlGetAll,
  ctrlAdd,
} = require("../../controllers/contacts-controllers");
const contactValidation = require("../../middlewares/validation/contact-validation");

router.get("/", ctrlGetAll);

router.post("/", contactValidation, ctrlAdd);

router.delete("/:contactId");

router.put("/:contactId");

module.exports = router;
