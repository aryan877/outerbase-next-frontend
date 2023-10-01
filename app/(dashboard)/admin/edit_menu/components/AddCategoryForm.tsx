import { trpc } from '@/app/_trpc/client';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

export function AddCategoryForm() {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value ? null : 'Category name is required'),
      description: (value) => (value ? null : 'Category description is required'),
    },
  });

  const queryClient = useQueryClient();

  const addCategoryMutation = trpc.category.addCategory.useMutation();

  const addCategoryHandler = (name: string, description: string) => {
    const addingCategoryNotificationId = notifications.show({
      loading: true,
      title: 'Adding Category',
      message: 'Adding the category...',
      color: 'yellow',
    });

    addCategoryMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          notifications.update({
            id: addingCategoryNotificationId,
            loading: false,
            title: 'Category Added Successfully',
            message: 'The category has been added successfully.',
            autoClose: 2000,
            color: 'green',
          });

          const listCategoriesQueryKey = getQueryKey(
            trpc.category.listCategories,
            undefined,
            'query'
          );
          queryClient.refetchQueries(listCategoriesQueryKey);
        },
        onError: () => {
          notifications.update({
            id: addingCategoryNotificationId,
            loading: false,
            title: 'Failed to Add Category',
            message: 'An error occurred while adding the category. Please try again later.',
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
            addCategoryHandler(values.name, values.description);
          })}
        >
          <Stack gap="md" justify="between">
            <TextInput
              withAsterisk
              label="Category Name"
              placeholder="Enter category name"
              {...form.getInputProps('name')}
            />
            <TextInput
              withAsterisk
              label="Category Description"
              placeholder="Enter category description"
              {...form.getInputProps('description')}
            />
          </Stack>
          <Box mt="md">
            <Button type="submit" fullWidth>
              Add Category
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
}
