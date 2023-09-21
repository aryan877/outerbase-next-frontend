import { Loader, Title, useComputedColorScheme } from '@mantine/core';
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

const PaymentForm = ({ orderid }: { orderid: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const computedColorScheme = useComputedColorScheme('light'); // Get the current color scheme
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update the `elements` appearance based on the color scheme
  useEffect(() => {
    if (elements) {
      const theme = computedColorScheme === 'dark' ? 'night' : 'flat';
      elements.update({ appearance: { theme } });
    }
  }, [computedColorScheme, elements]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const isDev = process.env.NODE_ENV === 'development';
    const successUrl = isDev
      ? 'http://localhost:3000/success'
      : `${process.env.NEXT_PUBLIC_DOMAIN}/success`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: successUrl,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'Something went wrong!');
    } else {
      setMessage(error.message as string);
    }

    setIsLoading(false);
  };

  return (
    <>
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className={`min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] p-4 lg:px-20 xl:px-40 flex flex-col gap-8 ${
          computedColorScheme === 'dark' ? 'text-gray-300' : '' // Apply dark mode text color
        }`}
      >
        <Title order={3}>Secure Payment - Order ID: {orderid}</Title>
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement
          id="payment-element"
          options={{
            layout: 'tabs',
          }}
        />
        <button disabled={isLoading || !stripe || !elements} id="submit" className="p-4">
          <span id="button-text">{isLoading ? <Loader size="sm" /> : 'Pay now'}</span>
        </button>

        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
};

export default PaymentForm;
