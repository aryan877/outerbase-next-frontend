// Import necessary libraries and components
'use client';
import { trpc } from '@/app/_trpc/client';
import { FoodItem } from '@/types/types';
import { formatCategoryName } from '@/utils/strings';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { AddFoodItemForm } from './components/AddFoodItemForm';
import FoodItemCard from './components/FoodItemCard';

function Page() {
  const { category } = useParams();
  const queryClient = useQueryClient();

  const {
    data: { response: { items: foodItems } = { items: [] } } = {},
    isLoading: isLoadingFoodItems,
  } = trpc.category.listCategoryItems.useQuery(
    { slug: category as string },
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

  const myFoodItems: FoodItem[] = foodItems;

  return (
    <Stack>
      <Title order={3} fw={700}>
        {formatCategoryName(category as string)}
      </Title>
      <Title order={4} c="dimmed">
        Add and Remove Food Items
      </Title>
      <Button
        onClick={() => {
          modals.open({
            title: 'Add Item',
            children: <AddFoodItemForm />,
          });
        }}
        w={200}
      >
        <Group>
          <IconPlus size={18} />
          <Text>Add new</Text>
        </Group>
      </Button>
      {isLoadingFoodItems || isLoadingCartItems ? (
        <div>Loading...</div>
      ) : myFoodItems.length === 0 ? (
        <div>No food items found. Add a new one.</div>
      ) : (
        myFoodItems.map((fooditem) => {
          return <FoodItemCard key={fooditem.itemid} fooditem={fooditem} />;
        })
      )}
    </Stack>
  );
}

export default Page;
