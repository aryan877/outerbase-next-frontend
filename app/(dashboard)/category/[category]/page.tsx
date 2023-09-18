'use client';
import { trpc } from '@/app/_trpc/client';
import { FoodItem } from '@/types/types';
import { Button, Card, Group, Image, NumberInput, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';

function page() {
  const { category } = useParams();

  const { data: { response: { items } = { items: [] } } = {}, isLoading } =
    trpc.category.listCategoryItems.useQuery(
      { slug: category },
      {
        staleTime: 10 * (60 * 1000), // 10 mins
        cacheTime: 15 * (60 * 1000), // 15 mins
      }
    );
  // const listChannelsKey = getQueryKey(trpc.channels.listChannels, undefined, 'query');
  // queryClient.refetchQueries(listChannelsKey);
  const addItemToCartMutation = trpc.cart.addItemToCart.useMutation();

  const fooditems: FoodItem[] = items;

  const addToCartHandler = (id: string) => {
    const addingToCartNotificationId = notifications.show({
      loading: true,
      title: 'Adding Item to cart',
      message: 'The selected item is being added to your cart.',
      color: 'yellow',
    });

    addItemToCartMutation.mutate(
      { itemid: parseInt(id), quantity: 1 },
      {
        onSuccess: ({ data }) => {
          notifications.update({
            id: addingToCartNotificationId,
            loading: false,
            title: 'Item Added to Cart',
            message: 'The selected item has been added to your cart.',
            autoClose: 2000,
            color: 'green',
          });
        },
        onError: () => {
          notifications.show({
            id: addingToCartNotificationId,
            loading: false,
            title: 'Failed to Add Item to Cart',
            message:
              'An error occurred while adding the item to your cart. Please try again later.',
            autoClose: 2000,
            color: 'red',
          });
        },
      }
    );
  };

  return (
    <Stack>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        fooditems.map((fooditem) => (
          <Card
            withBorder
            key={fooditem.itemid}
            shadow="xs"
            radius="md"
            style={{ cursor: 'pointer' }}
          >
            <Group gap="md" align="start">
              <Image
                height={200}
                width={200}
                style={{ height: '200px', width: '200px' }}
                src={fooditem.image}
                alt={fooditem.name}
              />
              <Stack>
                <Text size="lg" fw={700}>
                  {fooditem.name}
                </Text>
                <Text size="md">${fooditem.price}</Text>
                <NumberInput
                  label="Choose Quantity"
                  placeholder="Enter quantity"
                  clampBehavior="strict"
                  min={1}
                  max={100}
                  defaultValue={1}
                  allowNegative={false}
                />
                <Button
                  onClick={() => {
                    addToCartHandler(fooditem.itemid);
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Group>
          </Card>
        ))
      )}
    </Stack>
  );
}

export default page;
