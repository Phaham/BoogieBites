const express = require("express");
const shopController = require("../controllers/cartController");
// const isAuth = require("../middleware/is-auth");


const router = express.Router();

// router.get("/", shopController.getIndex);

// router.get("/products", shopController.getProducts);

// router.get("/products/:productId", shopController.getProduct);

// router.get("/products/specials/:prod", shopController.getSpecial);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.get("/orders", shopController.getOrders);

// router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders/:orderId", shopController.getInvoice);

router.get("/checkout", shopController.getCheckout);

router.get("/checkout/success", shopController.getCheckoutSuccess);

router.get("checkout/cancel", shopController.getCheckout);

module.exports = router;