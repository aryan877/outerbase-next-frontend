'use client';
import { trpc } from '@/app/_trpc/client';
import { CartItem, FoodItem } from '@/types/types';
import { Button, Flex, NumberInput, Stack, Table, Text, Title, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import Link from 'next/link';

function CartPage() {
  const queryClient = useQueryClient();
  const {
    data: { response: { items: cartItems } = { items: [] } } = {},
    isLoading: isLoadingCartItems,
  } = trpc.cart.getCartItemsPopulated.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const myCartItems: (CartItem & FoodItem)[] = cartItems;

  const modifyItemsInCartMutation = trpc.cart.modifyItemsInCart.useMutation();

  // Function to handle adding or modifying items in the cart
  const modifyCartItemsHandler = (id: number, quantity?: number) => {
    const modifyingCartNotificationId = notifications.show({
      loading: true,
      title: 'Modifying Item in Cart',
      message: 'The selected item is being modified in your cart.',
      color: 'yellow',
    });

    modifyItemsInCartMutation.mutate(
      { itemid: id, quantity: Number(quantity) },
      {
        onSuccess: () => {
          notifications.update({
            id: modifyingCartNotificationId,
            loading: false,
            title: 'Item Modified in Cart',
            message: 'The selected item has been modified in your cart.',
            autoClose: 2000,
            color: 'green',
          });
          const getCartItemsQueryKey = getQueryKey(trpc.cart.getCartItems, undefined, 'query');
          const getCartItemsPopulatedQueryKey = getQueryKey(
            trpc.cart.getCartItemsPopulated,
            undefined,
            'query'
          );
          queryClient.refetchQueries(getCartItemsPopulatedQueryKey);
          queryClient.refetchQueries(getCartItemsQueryKey);
        },
        onError: () => {
          notifications.update({
            id: modifyingCartNotificationId,
            loading: false,
            title: 'Failed to Modify Item in Cart',
            message:
              'An error occurred while modifying the item in your cart. Please try again later.',
            autoClose: 2000,
            color: 'red',
          });
        },
      }
    );
  };

  const calculateTotal = () => {
    // Calculate the subtotal of cart items
    const subtotal = myCartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    // Calculate the tax (15% of subtotal)
    const tax = 0.15 * Number(subtotal);

    // Calculate the total (subtotal + tax)
    const total = subtotal + tax;

    return {
      subtotal: subtotal,
      tax: tax,
      total: total,
    };
  };

  const totals = calculateTotal();

  const confirmationMessages = {
    title: 'Remove Item from Cart',
    confirmMessage:
      'Are you sure you want to remove this item from your cart? This action cannot be undone.',
    warningMessage: 'Warning: This will take the item out of your cart.',
  };

  const confirmationLabels = {
    confirm: 'Remove',
    cancel: 'Cancel',
  };

  const removeItemsFromCart = (id: number) => {
    modals.openConfirmModal({
      title: confirmationMessages.title,
      children: (
        <>
          <Text size="sm">{confirmationMessages.confirmMessage}</Text>
          <Text size="sm" c="red">
            {confirmationMessages.warningMessage}
          </Text>
        </>
      ),
      labels: confirmationLabels,
      centered: true,
      onCancel: () => console.log('canceled'),
      onConfirm: () => {
        modifyCartItemsHandler(id, Number(0));
      },
    });
  };

  return (
    <Stack gap="lg">
      {isLoadingCartItems ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          <Title order={3}>Your Cart ({cartItems.length})</Title>
          {cartItems.length === 0 ? (
            <Stack gap="md" align="center">
              Your cart is empty!
              <Link href="/">
                <Button variant="primary">Fill It Up</Button>
              </Link>
            </Stack>
          ) : (
            <>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {myCartItems.map((fooditem) => (
                    <Table.Tr key={fooditem.cartitemid}>
                      <Table.Td>{fooditem.name}</Table.Td>
                      <Table.Td>
                        <NumberInput
                          maw={200}
                          label="Choose Quantity"
                          clampBehavior="strict"
                          min={0}
                          max={100}
                          step={1}
                          value={fooditem.quantity}
                          allowNegative={false}
                          onChange={(value) => {
                            modifyCartItemsHandler(Number(fooditem.itemid), Number(value));
                          }}
                        />
                      </Table.Td>
                      <Table.Td>${fooditem.price}</Table.Td>
                      <Table.Td>
                        <Tooltip label="Remove item" position="top">
                          <Button
                            variant="light"
                            onClick={() => removeItemsFromCart(Number(fooditem.itemid))}
                          >
                            <IconX size={24} />
                          </Button>
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>{' '}
              <Stack>
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
              </Stack>
              <Flex justify="end">
                <Button size="large" variant="primary" style={{ width: 'fit-content' }}>
                  Proceed to pay
                </Button>
              </Flex>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default CartPage;
