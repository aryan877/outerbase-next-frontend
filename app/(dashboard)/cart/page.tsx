'use client';
import { Button, Stack, Table, Title, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

const dummyCartItems = [
  {
    cart_item_id: 1,
    item_name: 'Pizza',
    quantity: 2,
    item_price: 10.99,
  },
  {
    cart_item_id: 2,
    item_name: 'Burger',
    quantity: 3,
    item_price: 5.99,
  },
  {
    cart_item_id: 3,
    item_name: 'Salad',
    quantity: 1,
    item_price: 7.49,
  },
];

function CartPage() {
  // Use the dummyCartItems array for demonstration purposes
  const cartItems = dummyCartItems;

  const calculateTotal = () => {
    // Calculate the subtotal of cart items
    const subtotal = cartItems.reduce((total, item) => total + item.quantity * item.item_price, 0);

    // Calculate the tax (15% of subtotal)
    const tax = 0.15 * subtotal;

    // Calculate the total (subtotal + tax)
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const totals = calculateTotal();

  return (
    <Stack gap="lg">
      <Stack>
        <Title order={3}>Your Cart ({cartItems.length})</Title>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cartItems.map((item) => (
              <Table.Tr key={item.cart_item_id}>
                <Table.Td>{item.item_name}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>${item.item_price.toFixed(2)}</Table.Td>
                <Table.Td>
                  {' '}
                  <Tooltip label="Remove item">
                    <Button variant="light">
                      <IconX size={24} />
                    </Button>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
      <Stack>
        <Title order={3}>Your Total</Title>
        <Table>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Subtotal:</Table.Td>
              <Table.Td>${totals.subtotal}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Tax (15%):</Table.Td>
              <Table.Td>${totals.tax}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Total:</Table.Td>
              <Table.Td>${totals.total}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Stack>
      <Button size="large" variant="primary" style={{ width: 'fit-content' }}>
        Proceed to pay
      </Button>
    </Stack>
  );
}

export default CartPage;
