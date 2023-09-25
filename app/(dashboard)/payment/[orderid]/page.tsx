'use client';
import { trpc } from '@/app/_trpc/client';
import { Address, Order } from '@/types/types';
import { Text } from '@mantine/core';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
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
      staleTime: Infinity,
      onSuccess: (data) => {
        setClientSecret(data.clientSecret as string);
      },
    }
  );

  const {
    data: { response: { items: orderItems } = { items: [] } } = {},
    isLoading: isLoadingOrderItem,
  } = trpc.order.getOrderById.useQuery(
    { orderid: orderid },
    {
      // staleTime: 10 * (60 * 1000), // 10 mins
      // cacheTime: 15 * (60 * 1000), // 15 mins
    }
  );

  const orderItem = orderItems[0] as Order;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  //address data for address picking
  const {
    data: { response: { items: addresses } = { items: [] } } = {},
    isLoading: isLoadingAddresses,
  } = trpc.address.getUserAddresses.useQuery(undefined, {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const myAddresses: Address[] = addresses;

  return isLoading || !clientSecret ? (
    <div>Loading...</div>
  ) : (
    <div>
      {orderItem.payment_status ? (
        // Order has already been paid
        <div>
          <Text>This order has already been paid.</Text>
          <Link href="/orders">Go to Orders</Link>
        </div>
      ) : (
        // Display payment form
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm orderid={orderid} />
        </Elements>
      )}
    </div>
  );
};

export default PayPage;
