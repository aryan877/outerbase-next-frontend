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
import { useRouter } from 'next/navigation';

function CartPage() {
  const queryClient = useQueryClient();
  const {
    data: { response: { items: cartItems } = { items: [] } } = {},
    isLoading: isLoadingCartItems,
  } = trpc.cart.getCartItemsPopulated.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });
  const router = useRouter();
  const myCartItems: (CartItem & FoodItem)[] = cartItems;

  const modifyItemsInCartMutation = trpc.cart.modifyItemsInCart.useMutation();
  const createOrderMutation = trpc.order.createOrder.useMutation();

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
    const tax = (Number(process.env.NEXT_PUBLIC_TAX_PERCENTAGE) / 100) * Number(subtotal);

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

  const handleCheckout = async () => {
    try {
      const orderCreationNotificationId = notifications.show({
        loading: true,
        title: 'Creating Order Record in Database',
        message: 'Your order is being processed. Please wait...',
        color: 'yellow',
      });

      createOrderMutation.mutate(
        {
          myCartItems,
        },
        {
          onSuccess: (data: any) => {
            notifications.update({
              id: orderCreationNotificationId,
              loading: false,
              title: 'Redirecting to Payments Page',
              message: 'Your order has been created and is now awaiting payment.',
              autoClose: 2000,
              color: 'yellow',
            });
            router.push(`/payment/${data.orderid}`);
            // const getCartItemsQueryKey = getQueryKey(trpc.cart.getCartItems, undefined, 'query');
            // const getCartItemsPopulatedQueryKey = getQueryKey(
            //   trpc.cart.getCartItemsPopulated,
            //   undefined,
            //   'query'
            // );
            // queryClient.refetchQueries(getCartItemsPopulatedQueryKey);
            // queryClient.refetchQueries(getCartItemsQueryKey);
          },
          onError: () => {
            notifications.update({
              id: orderCreationNotificationId,
              loading: false,
              title: 'Failed to Create Order',
              message: 'There was an error while creating your order. Please try again later.',
              autoClose: 2000,
              color: 'red',
            });
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  myCartItems.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

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
                    <Table.Th>Actions</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Total</Table.Th>
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
                      <Table.Td>${fooditem.price}</Table.Td>
                      <Table.Td>${(fooditem.price * fooditem.quantity).toFixed(2)} </Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text fw="bold">Subtotal:</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw="bold">${totals.subtotal.toFixed(2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text fw="bold">Tax (15%):</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw="bold">${totals.tax.toFixed(2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text fw="bold">Total:</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw="bold">${totals.total.toFixed(2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>{' '}
              <Stack>
                {/* <Title order={3}>Your Total</Title> */}
                {/* <Table striped>
                  <Table.Tbody>
                  
                  </Table.Tbody>
                </Table>
              </Stack> */}
              </Stack>
              <Flex justify="end">
                <Button
                  size="large"
                  variant="primary"
                  style={{ width: 'fit-content' }}
                  onClick={handleCheckout}
                  disabled={createOrderMutation.isLoading}
                >
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
