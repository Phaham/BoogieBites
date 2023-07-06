import axios from "axios";
import { showAlert } from "./alerts";
// import { LocalCart } from "./order";

const Stripe = require('stripe');

const stripe = Stripe(
  "pk_test_51M135mSEgiNHw8gEmGOQYTnqkTOJTaZNwaxsCYUwetMm6oahO0tiT3RPuEitUqqmyHAClxe0Ca11VQHc63pjIikd00vWeAbnyq"
);

// export const placeOrder = async () => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(`/api/v1/orders/create-checkout-session/`);
//     console.log(session);
//     // 2) Create checkout form + charge credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert("error", err);
//   }
// };

export const placeOrder = () =>{
  fetch("/create-checkout-session", {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    body: JSON.stringify({
      "product": {
        "name": "iPhone 12",
        "image": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-purple-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1617130317000",
        "amount": 100,
        "quantity": 1
      }
    })
    // body: JSON.stringify(items),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
};