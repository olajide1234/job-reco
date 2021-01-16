import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { loadStripe } from "@stripe/stripe-js";
import 'bootstrap/dist/css/bootstrap.min.css';
import dog from './remind_bull_350.jpeg';
import './App.css';
import { Col, Container, Row, Form, Button, Spinner, Image } from 'react-bootstrap';
import { useFormik } from 'formik';
const stripePromise = loadStripe("pk_live_51I8VuHGcuFzCPgillATVKVySWzt2DlsSoVLyT4nmAFNYuQedazFOYtSPpqgj8LNUZ1p3DeHFGHgFO5UJlGTfLMq200RuXnBvhE");
const urldep = "https://goalbully.com/"

const Message = ({ message }) => (
  <div style={{ fontFamily: 'monospace', wordSpacing: '-3px' }}>
    <div style={{ paddingTop: '15%', textAlign: 'center' }}>
      <h2 style={{ paddingTop: '5%' }}>{message}</h2>
      <Button onClick={() => window.location.href = urldep}>Go Home</Button>
    </div>
  </div>
);

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : decodeURIComponent(a[1]);

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }
  return obj;
}


function App() {

  const [message, setMessage] = useState("");
  const [buttonloading, setButtonloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showform, setShowform] = useState(false);
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      async function postData() {

        const response = await axios.post('https://sheetdb.io/api/v1/04rdl1glvaj42', {
          "data": getAllUrlParams()
        });
        if (response.status === 201) {
          setMessage(`Order placed! \n You will receive an email confirmation.`);
        } else {
          setMessage(`An error occured, but your payment may have been received.\n We will send an email to complete the order.`);
        }
      }
      postData();
    } else if (query.get("canceled")) {
      setMessage(
        "Order canceled -- modify your order and checkout when you're ready."
      );
    } else {
      setLoading(false);
    }
  }, []);

  const validate = values => {
    
    const errors = {};
    if (!values.fname) {
      errors.fname = 'Required';
    }

    if (!values.lname) {
      errors.lname = 'Required';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.goal) {
      errors.goal = 'Required';
    }

    return errors;
  };
  
  const formik = useFormik({
    initialValues: {
      email: '',
      facebookusername: '',
      finishdate: '',
      fname: '',
      goal: '',
      harass: 'private',
      instagramhandle: '',
      lname: '',
      signalnumber: '',
      twitterhandle: '',
      telegramnumber: '',
      whatsappnumber: '',
    },
    validate,
    onSubmit: async values => {
      try {
        setButtonloading(true);
        const stripe = await stripePromise;
        const response = await fetch("/create-checkout-session", {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(values)
        });
        const session = await response.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (result.error) {
          setMessage(`Opps! We are so sorry; an error occured. \n Please refresh page and try again.`);
        }
      } catch (error) {
        setMessage(`Opps! We are so sorry; an error occured. \n Please refresh page and try again.`);
      }
    }
  });

  if (message) {
    return (
      <Message message={message} />
    )
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '15%', textAlign: 'center' }}>
          <Spinner style={{ width: '5rem', height: '5rem' }} animation="grow" />
      </div>
    )
  }

  return (
    <div className="App" style={{ fontFamily: 'monospace', wordSpacing: '-3px', paddingBottom: '10px'}}>

      <Row style={{ height: '80vh'}}>
        { 
          !showform ?
          <Col style={{ textAlign: 'center', alignSelf: 'center', padding: '25px' }} lg={true}>
              <h1 style={{marginTop: '3%'}}>We will remind, bully, harass and intimidate you <br></br>until you acheive your goal!</h1>
            <h3>
              &#128520;
                </h3>
              <Button style={{ marginTop: '2%', marginBottom: '20px' }} size="lg" onClick={() => setShowform(true)}>Try now >></Button>
        </Col> 
          : <Col style={{ textAlign: 'center',  paddingTop: '2%' }}>
            <Image src={dog} roundedCircle />
            <h4 style={{ paddingTop: '10%' }}>
              We will hound you !!!
          </h4>
            <p style={{ paddingTop: '10%' }}>
              Service costs USD$5 and lasts for a month only. Due to legal constraints, we have to desist at your request. No refunds for desist requests.</p>
            </Col> 
          }



        {showform ? 
        <Col>
           <Container style={{ marginTop: '2%', marginBottom: '3%' }}>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First name*:</Form.Label>
                  <Form.Control
                    type="text"
                    name="fname"
                    value={formik.values.fname}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.fname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.fname && formik.errors.fname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Last name*:</Form.Label>
                  <Form.Control
                    type="text"
                    name="lname"
                    value={formik.values.lname}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.lname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.lname && formik.errors.lname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Tell us about your goal. Highlight any milestones*:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="goal"
                    rows="2"
                    cols="20"
                    value={formik.values.goal}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.goal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.goal && formik.errors.goal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>


              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Email address*:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email && formik.errors.email}
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Target completion date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="finishdate"
                    value={formik.values.finishdate}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Form.Row>


              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Would you like us to harass you publicly or privately:</Form.Label>
                  <Form.Control as="select" value={formik.values.harass}
                    onChange={formik.handleChange} name="harass" custom>
                    <option value="private" label="private">Privately only</option>
                    <option value="public" label="public">Publicly only</option>
                    <option value="both" label ="both">Both privately and publicly</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} >
                  <Form.Label>Twitter handle:</Form.Label>
                  <Form.Control
                    type="text"
                    name="twitterhandle"
                    value={formik.values.twitterhandle}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Facebook username:</Form.Label>
                  <Form.Control
                    type="text"
                    name="facebookusername"
                    value={formik.values.facebookusername}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Form.Row>


              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Instagram handle:</Form.Label>
                  <Form.Control
                    type="text"
                    name="instagramhandle"
                    value={formik.values.instagramhandle}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>WhatsApp number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="whatsappnumber"
                    value={formik.values.whatsappnumber}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Form.Row>



              <Form.Row>
                <Form.Group as={Col} >
                  <Form.Label>Telegram number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="telegramnumber"
                    value={formik.values.telegramnumber}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Signal number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="signalnumber"
                    value={formik.values.signalnumber}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Form.Row>
              <Button type="submit">{buttonloading ? 'Loading…' : 'Submit and pay $5'}</Button>
            </Form>
          </Container> 
        </Col>
          : null} 
      </Row>
    </div>
  );
}

export default App;
