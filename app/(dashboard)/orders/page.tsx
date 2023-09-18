import { Card, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

type OrderStatus = 'Order Received' | 'Preparation Started' | 'Delivered';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  deliveryAddress: string;
  orderDate: string;
  deliveryStatus: OrderStatus;
  total: number;
};

const dummyOrders: Order[] = [
  {
    id: 1,
    orderNumber: '12345',
    items: [
      { name: 'Pizza', quantity: 2, price: 10.99 },
      { name: 'Coke', quantity: 1, price: 2.49 },
    ],
    deliveryAddress: '123 Main Street, New York, NY 10001',
    orderDate: '2023-09-20 15:30',
    deliveryStatus: 'Order Received',
    total: 26.97,
  },
  {
    id: 2,
    orderNumber: '67890',
    items: [
      { name: 'Burger', quantity: 3, price: 5.99 },
      { name: 'Fries', quantity: 2, price: 3.99 },
    ],
    deliveryAddress: '456 Elm Avenue, Los Angeles, CA 90001',
    orderDate: '2023-09-19 18:45',
    deliveryStatus: 'Delivered',
    total: 29.94,
  },
  {
    id: 3,
    orderNumber: '13579',
    items: [
      { name: 'Salad', quantity: 1, price: 7.49 },
      { name: 'Water', quantity: 2, price: 1.99 },
    ],
    deliveryAddress: '789 Oak Road, Chicago, IL 60601',
    orderDate: '2023-09-18 12:15',
    deliveryStatus: 'Delivered',
    total: 10.47,
  },
];

function Orders() {
  return (
    <Stack gap="md">
      <Title order={3} fw={700}>
        Your Orders
      </Title>
      <Stack gap="md">
        {dummyOrders.map((order) => (
          <Card key={order.id} padding="lg" withBorder radius="lg">
            <Text size="xl" fw={700}>
              Order #{order.orderNumber}
            </Text>
            <Text>Delivery Address:</Text>
            <Text>{order.deliveryAddress}</Text>
            <Text>Order Date: {order.orderDate}</Text>
            <Text>Delivery Status: {order.deliveryStatus}</Text>
            <Text>Total: ${order.total.toFixed(2)}</Text>
            <Link href={`/order/${order.id}`}>See More</Link>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default Orders;
