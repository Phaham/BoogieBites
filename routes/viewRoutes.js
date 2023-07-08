const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(viewsController.alerts);

router.get(
  '/',
  authController.isLoggedIn,
  viewsController.getLandingPage
);

router.get('/category/:slug', authController.isLoggedIn, viewsController.getCategory);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/dashboard', authController.protect, viewsController.getAccount);
router.get('/my-orders', authController.protect, viewsController.getMyOrders);

router.get('/email/welcome', viewsController.welcomeEmail);

// ❗
router.get('/recipe/:slug',authController.isLoggedIn, viewsController.getRecipe);
router.get('/contact', authController.isLoggedIn, viewsController.getContact);
router.get('/paymentSuccess', authController.protect, authController.isLoggedIn, viewsController.getpaymentSuccess);
router.get('/paymentFailed', authController.protect, authController.isLoggedIn, viewsController.getpaymentFailed);
router.get('/testCard', authController.protect, authController.isLoggedIn, viewsController.getTestCard);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
