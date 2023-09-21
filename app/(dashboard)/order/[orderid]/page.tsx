'use client';
import { trpc } from '@/app/_trpc/client';
import { CartItem, FoodItem, Order } from '@/types/types';
import { Box, Card, Stack, Table, Text, Timeline, Title } from '@mantine/core';
import { IconBike, IconCheck, IconCooker, IconPackage } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the desired locale (e.g., English)
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
        <Stack>
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
                {orderItem.ordered_at && (
                  <>
                    <strong>Ordered At:</strong>{' '}
                    {dayjs(orderItem.ordered_at).format('D MMM YYYY, h:mm a')}
                  </>
                )}
              </Text>

              {orderItem.delivered_at && (
                <Text>
                  <strong>Delivered At:</strong> {orderItem.delivered_at}
                </Text>
              )}
              <Text>
                <strong>Delivery Address:</strong> {orderItem.delivery_address}
              </Text>
              {orderItem.payment_status !== undefined && (
                <Text>
                  <strong>Payment Status:</strong> {orderItem.payment_status ? 'Paid' : 'Unpaid'}
                </Text>
              )}
              {/* <Timeline active={1} bulletSize={24} lineWidth={2}>
                {orderItem.delivery_status === 'Order Received' && (
                  <Timeline.Item color="blue">Order Received</Timeline.Item>
                )}
                {orderItem.delivery_status === 'Preparation Started' && (
                  <Timeline.Item color="orange">Preparation Started</Timeline.Item>
                )}
                {orderItem.delivery_status === 'Delivered' && (
                  <Timeline.Item color="green">Delivered</Timeline.Item>
                )}
                
              </Timeline> */}
              <Timeline
                active={getActiveStepNumber(orderItem.delivery_status as string)}
                bulletSize={24}
                lineWidth={2}
              >
                <Timeline.Item title="Order Placed" bullet={<IconPackage size={20} />}>
                  <Text c="dimmed" size="sm">
                    Your order has been placed successfully.
                  </Text>
                  <Text size="xs" mt={4}>
                    2 hours ago
                  </Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconCooker size={12} />} title="Preparation Started">
                  <Text c="dimmed" size="sm">
                    Your order preparation has started.
                  </Text>
                  <Text size="xs" mt={4}>
                    52 minutes ago
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
                  <Text size="xs" mt={4}>
                    15 minutes ago
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
                  <Text size="xs" mt={4}>
                    34 minutes ago
                  </Text>
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
                    {orderItem.order_items.map((_, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{_.name}</Table.Td>
                        <Table.Td>${_.price}</Table.Td>
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
                      <Table.Td>${totals.subtotal.toFixed(2)}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Tax (15%):</Table.Td>
                      <Table.Td>${totals.tax.toFixed(2)}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Total:</Table.Td>
                      <Table.Td>${totals.total.toFixed(2)}</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Box>
              <Text>
                <strong>Total Price:</strong> {orderItem.total_price}
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
          </Card>
        </Stack>
      )}
    </div>
  );
}

export default Page;
