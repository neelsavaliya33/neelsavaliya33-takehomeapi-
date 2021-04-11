const express = require("express");
const productController = require("./../controller/productController");

const router = express.Router();

router.route("/").get(productController.index);


router.route("/create").post(productController.create);

router.route("/most-viewed/:limit?").get(productController.mostViewed);

router.route("/delete/:id").delete(productController.delete);

router.route("/:id").get(productController.oneProduct);

module.exports = router;
