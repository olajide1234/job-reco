const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));
const YOUR_DOMAIN = 'https://tough-reminder.herokuapp.com/';
app.post('/create-checkout-session', async (req, res) => {
  const serialize = function (obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  try {
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'A stubborn, intimidating 30-day reminder',
              images: ['https://i.ibb.co/yPDjRg2/remind-bull.jpg'],
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true&${serialize(req.body)}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    res.json({ id: session.id });
  } catch (error) {
    res.json('error').status(500)
  }

});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(4242, () => console.log('Running on port 4242'));
