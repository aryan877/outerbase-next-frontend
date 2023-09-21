'use client';
import { trpc } from '@/app/_trpc/client';
import { Order } from '@/types/types';
import { Button, Card, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the desired locale (e.g., English)
import Link from 'next/link';

function Orders() {
  dayjs.locale('en');

  const {
    data: { response: { items: orderItems } = { items: [] } } = {},
    isLoading: isLoadingOrderItems,
  } = trpc.order.getOrders.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const myOrderItems: Order[] = orderItems;

  return (
    <Stack gap="md">
      {isLoadingOrderItems ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title order={3} fw={700}>
            Your Orders
          </Title>
          <Stack gap="md">
            {myOrderItems.map((order) => (
              <Card key={order.orderid} padding="lg" withBorder radius="lg">
                <Stack>
                  <Text size="xl" fw={700}>
                    Order #{order.orderid}
                  </Text>
                  <Text>Order Date: {dayjs(order.ordered_at).format('D MMM YYYY, h:mm a')}</Text>
                  <Text>Delivery Status: {order.delivery_status}</Text>
                  <Text>Total: ${order.total_price}</Text>
                  <Link href={`/order/${order.orderid}`}>
                    <Button>See More</Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default Orders;
