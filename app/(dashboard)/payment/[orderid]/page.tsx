'use client';
import { trpc } from '@/app/_trpc/client';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PayPage = ({ params }: { params: { orderid: string } }) => {
  const [clientSecret, setClientSecret] = useState('');

  const { orderid } = params;

  const { data, isLoading } = trpc.stripe.createIntent.useQuery(
    {
      orderid: orderid,
    },
    {
      onSuccess: (data) => {
        setClientSecret(data.clientSecret as string);
      },
    }
  );

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm orderid={orderid} />
        </Elements>
      )}
    </div>
  );
};

export default PayPage;
