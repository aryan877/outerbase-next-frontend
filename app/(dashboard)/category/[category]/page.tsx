// Import necessary libraries and components
'use client';
import { trpc } from '@/app/_trpc/client';
import { CartItem, FoodItem } from '@/types/types';
import { formatCategoryName } from '@/utils/strings';
import { Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useParams } from 'next/navigation';
import FoodItemCard from './components/FoodItemCard';

function Page() {
  const { category } = useParams();
  const queryClient = useQueryClient();

  const {
    data: { response: { items: foodItems } = { items: [] } } = {},
    isLoading: isLoadingFoodItems,
  } = trpc.category.listCategoryItems.useQuery(
    { slug: category },
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
    }
  );

  // Fetch cart items data using trpc query
  const {
    data: { response: { items: cartItems } = { items: [] } } = {},
    isLoading: isLoadingCartItems,
  } = trpc.cart.getCartItems.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const modifyItemsInCartMutation = trpc.cart.modifyItemsInCart.useMutation();

  const myFoodItems: FoodItem[] = foodItems;
  const myCartItems: CartItem[] = cartItems;

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

  return (
    <Stack>
      <Title order={4}>{formatCategoryName(category)}</Title>
      {isLoadingFoodItems || isLoadingCartItems ? (
        <div>Loading...</div>
      ) : (
        myFoodItems.map((fooditem) => {
          const cartItem = myCartItems.find((item) => item.itemid === fooditem.itemid);

          return (
            <FoodItemCard
              key={fooditem.itemid}
              fooditem={fooditem}
              cartItem={cartItem}
              modifyCartItemsHandler={modifyCartItemsHandler}
            />
          );
        })
      )}
    </Stack>
  );
}

export default Page;
