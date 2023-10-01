'use client';
import { trpc } from '@/app/_trpc/client';
import { CartItem, FoodItem, Order } from '@/types/types';
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconBike, IconBowl, IconCheck, IconCooker } from '@tabler/icons-react';
import { default as dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { QueryForm } from './components/QueryForm';
import { ReviewForm } from './components/ReviewForm';
dayjs.extend(relativeTime);
function Page({ params }: { params: { orderid: string } }) {
  const { orderid } = params;
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

  const [success, setSuccess] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#success') {
      setSuccess(true);
      setIsExploding(true);
      const explosionTimeout = setTimeout(() => {
        setIsExploding(false);
      }, 3000);
      // Cleanup the timeout if the component unmounts
      return () => clearTimeout(explosionTimeout);
    }
  }, []);

  const orderItem = orderItems[0] as Order;

  function getActiveStepNumber(deliveryStatus: string) {
    switch (deliveryStatus) {
      case 'Order Received':
        return 0;
      case 'Preparation Started':
        return 1;
      case 'On The Way':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0; // Default to 0 if the status is not recognized
    }
  }

  const calculateTotal = () => {
    // Calculate the subtotal of cart items
    const subtotal = orderItem?.order_items?.reduce(
      (total: number, item: FoodItem & CartItem) =>
        total + Number(item.quantity) * Number(item.price),
      0
    );

    // Calculate the tax (15% of subtotal)
    const tax = (Number(15) / 100) * Number(subtotal);

    // Calculate the total (subtotal + tax)
    const total = subtotal + tax;

    return {
      subtotal: subtotal,
      tax: tax,
      total: total,
    };
  };

  const totals = calculateTotal();

  return (
    <div>
      {isLoadingOrderItem ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {success && isExploding && (
            <Center>
              <ConfettiExplosion />
            </Center>
          )}
          {success && (
            <Stack mb="md">
              <Title order={3}>Order Placed Successfully</Title>
              <Text c="dimmed" size="lg">
                Your delicious food is on its way!
              </Text>
              <Text c="dimmed" size="sm">
                Expect it to arrive within the estimated delivery time.
              </Text>
            </Stack>
          )}

          <Card p={32} withBorder radius="lg">
            <Stack gap="md">
              <Title order={3}>Order #{orderid}</Title>
              {/* <Text>
                {orderItem.userid && (
                  <>
                    <strong>User ID:</strong> {orderItem.userid}
                  </>
                )}
              </Text> */}
              <Text>
                {orderItem?.ordered_at && (
                  <>
                    <strong>Ordered At:</strong>{' '}
                    {dayjs(orderItem?.ordered_at).format('D MMM YYYY, h:mm a')}
                  </>
                )}
              </Text>

              {orderItem.delivered_at && (
                <Text>
                  <strong>Delivered At:</strong> {orderItem.delivered_at}
                </Text>
              )}
              <Text>
                <strong>Delivery Address:</strong> {orderItem.flat_number}, {orderItem.street},{' '}
                {orderItem.landmark}, {orderItem.state}, {orderItem.pincode}
              </Text>
              {orderItem.payment_status !== undefined && (
                <div>
                  <Text>
                    <strong>Payment Status:</strong>{' '}
                    {orderItem.payment_status ? (
                      <Badge color="green">Paid</Badge>
                    ) : (
                      <Badge color="red">Unpaid</Badge>
                    )}
                  </Text>
                  {!orderItem.payment_status && (
                    <Link href={`/payment/${orderItem.orderid}`}>
                      <Button my="md">Retry Payment</Button>
                    </Link>
                  )}
                </div>
              )}

              <Timeline
                active={getActiveStepNumber(orderItem.delivery_status as string)}
                bulletSize={24}
                lineWidth={2}
              >
                <Timeline.Item title="Order Placed" bullet={<IconBowl size={20} />}>
                  <Text c="dimmed" size="sm">
                    Your order has been placed successfully.
                  </Text>
                  <Text size="xs" mt={4}>
                    {dayjs(orderItem.ordered_at).fromNow()}
                  </Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconCooker size={12} />} title="Preparation Started">
                  <Text c="dimmed" size="sm">
                    Your order preparation has started.
                  </Text>
                </Timeline.Item>

                <Timeline.Item
                  title="On the Way"
                  bullet={<IconBike size={20} />}
                  lineVariant="dashed"
                >
                  <Text c="dimmed" size="sm">
                    Your order is on the way.
                  </Text>
                </Timeline.Item>

                <Timeline.Item
                  title="Delivered"
                  bullet={<IconCheck size={20} />}
                  lineVariant="dashed"
                >
                  <Text c="dimmed" size="sm">
                    Your order has been successfully delivered.
                  </Text>
                  {orderItem.delivered_at && (
                    <Text size="xs" mt={4}>
                      {dayjs(orderItem.delivered_at).fromNow()}
                    </Text>
                  )}
                </Timeline.Item>
              </Timeline>

              <Box>
                <Title order={3}>Order Items</Title>

                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Quantity</Table.Th>
                      {/* Add more headers as needed */}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {orderItem?.order_items?.map((_, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{_.name}</Table.Td>
                        <Table.Td>
                          {' '}
                          {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                          {_.price}
                        </Table.Td>
                        <Table.Td>{_.quantity}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
              <Box>
                <Title order={3}>Your Total</Title>
                <Table striped>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>Subtotal:</Table.Td>
                      <Table.Td>
                        {' '}
                        {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                        {totals.subtotal.toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Tax (15%):</Table.Td>
                      <Table.Td>
                        {' '}
                        {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                        {totals.tax.toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Total:</Table.Td>
                      <Table.Td>
                        {' '}
                        {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                        {totals.total.toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Box>
              <Text>
                <strong>Total Price:</strong> {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                {orderItem.total_price}
              </Text>
              {orderItem.coupon_code && (
                <Text>
                  <strong>Coupon Code:</strong> {orderItem.coupon_code}
                </Text>
              )}
              <Text>
                <strong>Email:</strong> {orderItem.email}
              </Text>
              <Text>
                <strong>Phone Number:</strong> {orderItem.phone_number}
              </Text>
            </Stack>
            <Stack mt="md">
              <Button
                onClick={() => {
                  modals.open({
                    title: 'Send Query',
                    children: <QueryForm />,
                  });
                }}
              >
                Help
              </Button>
              <Button
                onClick={() => {
                  modals.open({
                    title: 'Leave a Review',
                    children: <ReviewForm />,
                  });
                }}
              >
                Leave a Review
              </Button>
            </Stack>
          </Card>
        </>
      )}
    </div>
  );
}

export default Page;
