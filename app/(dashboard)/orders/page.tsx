'use client';
import { trpc } from '@/app/_trpc/client';
import { Order } from '@/types/types';
import { Button, Card, Pagination, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the desired locale (e.g., English)
import Link from 'next/link';
import { useState } from 'react';

function Orders() {
  dayjs.locale('en');
  const [activePage, setPage] = useState(1);

  const {
    data: { response: { items: orderItems } = { items: [] } } = {},
    isLoading: isLoadingOrderItems,
  } = trpc.order.getOrders.useQuery(
    { page: activePage },
    {
      // staleTime: 10 * (60 * 1000), // 10 mins
      // cacheTime: 15 * (60 * 1000), // 15 mins
    }
  );

  const {
    data: { response: { items: orderCount } = { items: [] } } = {},
    isLoading: isLoadingOrderCount,
  } = trpc.order.getOrderCount.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    staleTime: Infinity,
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const pageCount = orderCount[0]?.total_count / 10;
  const myOrderItems: Order[] = orderItems;

  return (
    <Stack gap="md">
      {isLoadingOrderItems ? (
        <div>Loading...</div>
      ) : orderItems.length === 0 ? (
        <Text>You have not placed any orders</Text>
      ) : (
        <>
          <Title order={3} fw={700}>
            Your Orders
          </Title>
          <Stack gap="md">
            {myOrderItems.map((order) => (
              <Card key={order?.orderid} padding="lg" withBorder radius="lg">
                <Stack>
                  <Text size="xl" fw={700}>
                    Order #{order.orderid}
                  </Text>
                  <Text>Order Date: {dayjs(order?.ordered_at).format('D MMM YYYY, h:mm a')}</Text>
                  <Text>Delivery Status: {order?.delivery_status}</Text>
                  <Text>
                    Total: {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
                    {order?.total_price}
                  </Text>
                  <Link href={`/order/${order?.orderid}`}>
                    <Button>See More</Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </Stack>
          {!isLoadingOrderCount && (
            <Pagination value={activePage} onChange={setPage} total={pageCount} />
          )}
        </>
      )}
    </Stack>
  );
}

export default Orders;
