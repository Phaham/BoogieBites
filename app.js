const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

// const session = require('express-session');
const bodyParser = require('body-parser');

const categoryRouter = require("./routes/categoryRoutes");
const userRouter = require("./routes/userRoutes");

const dishRouter = require("./routes/dishRoutes");
// const cartRouter = require("./routes/cartRoutes");

const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
// const orderRouter = require("./routes/orderRoutes");
// const { webhookCheckout } = require("./controllers/orderController");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.enable("trust proxy");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Set security headers and implement CORS
app.use(helmet());
app.use(cors()); // for get and post


app.options("*", cors()); // for patch and delete
// app.options('/api/v1/categories/:id', cors());

// Development logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
// app.use((req, res, next) => {
//   if (req.originalUrl === '/webhook') {
//     next(); // Do nothing with the body because I need it in a raw state.
//   } else {
//     express.json({ limit: "10kb" })  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
//   }
// });
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "ratingsQuantity",
      "ratingsAverage",
      "price",
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});



app.use(bodyParser.json());
// app.use((req, res, next) => {
//   if (req.originalUrl === '/webhook') {
//     next(); 
//   } else {
//     bodyParser.json()
//   }
// });
app.use(bodyParser.urlencoded({ extended: false }));


// Routes
app.use("/", viewRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dishes", dishRouter);
app.use("/api/v1/reviews", reviewRouter);


////////////////////////////////////////////////////////////////////////////////////////////////////////

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(stripeSecretKey);

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  const lineItems = [];
  for (let item of items) {

    const productName = item.name;
    const productImage = item.image;
    const price = item.price;
    const productQuantity = item.quantity;
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: productName,
          images: [productImage],
        },
        unit_amount: price * 100,
      },
      quantity: productQuantity,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    // success_url: `${req.protocol}://${req.get("host")}/paymentSuccess`,
    success_url: `${req.protocol}://${req.get("host")}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get("host")}/paymentFailed?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.json({ id: session.id });
});

// app.get('/paymentSuccess', async (req, res) => {
//   // const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
//   // const customer = await stripe.customers.retrieve(session.customer);
//   // console.log(customer.name)
//   // res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);

//   res.status(200).render('paymentSuccess', {
//     title: 'payment_success',
//   });
// });


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

let paymentStatus = 'FAILED';

const fulfillOrder = (status) => {
  paymentStatus = status;
};

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      let status = 'success';
      fulfillOrder(status);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.send();
});
app.get('/my-orders', async (req, res) => {
  res.status(200).render('myOrders', { paymentStatus });
});
//////////////////////////////////////////////////////////////////////////////////////

app.all("*", (req, res, next) => {
  // res.status(404).render('404', {
  //   title: 'Error 404',
  //  });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
