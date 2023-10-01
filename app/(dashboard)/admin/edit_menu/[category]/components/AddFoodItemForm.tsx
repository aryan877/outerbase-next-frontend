import { trpc } from '@/app/_trpc/client';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useParams } from 'next/navigation';

export function AddFoodItemForm() {
  const { category } = useParams();
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: '',
    },
    validate: {
      name: (value) => (value ? null : 'Food item name is required'),
      description: (value) => null,
      price: (value) =>
        value && !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
          ? null
          : 'Price must be a valid number',
    },
  });

  const queryClient = useQueryClient();

  const addFoodItemMutation = trpc.category.addCategoryItem.useMutation();

  const addFoodItemHandler = (name: string, description: string, price: string) => {
    const addingFoodItemNotificationId = notifications.show({
      loading: true,
      title: 'Adding Food Item',
      message: 'Adding the food item...',
      color: 'yellow',
    });

    addFoodItemMutation.mutate(
      { name, description, price: parseFloat(price), category: category as string },
      {
        onSuccess: () => {
          notifications.update({
            id: addingFoodItemNotificationId,
            loading: false,
            title: 'Food Item Added Successfully',
            message: 'The food item has been added successfully.',
            autoClose: 2000,
            color: 'green',
          });
          const listCategoryItemsQueryKey = getQueryKey(
            trpc.category.listCategoryItems,
            undefined,
            'query'
          );
          queryClient.refetchQueries(listCategoryItemsQueryKey);
        },
        onError: () => {
          notifications.update({
            id: addingFoodItemNotificationId,
            loading: false,
            title: 'Failed to Add Food Item',
            message: 'An error occurred while adding the food item. Please try again later.',
            autoClose: 2000,
            color: 'red',
          });
        },
        onSettled: () => {
          modals.closeAll();
        },
      }
    );
  };

  return (
    <>
      <Stack>
        <form
          onSubmit={form.onSubmit((values) => {
            addFoodItemHandler(values.name, values.description, values.price);
          })}
        >
          <Stack gap="md" justify="between">
            <TextInput
              withAsterisk
              label="Food Item Name"
              placeholder="Enter food item name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Description"
              placeholder="Enter description"
              {...form.getInputProps('description')}
            />
            <TextInput
              withAsterisk
              label="Price"
              placeholder={`Enter price in ${process.env.NEXT_PUBLIC_CURRENCY}`}
              type="number"
              min="0"
              step="0.01"
              {...form.getInputProps('price')}
            />
          </Stack>
          <Box mt="md">
            <Button type="submit" fullWidth>
              Add Food Item
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
}
