'use client';
import { trpc } from '@/app/_trpc/client';
import { Category } from '@/types/types';
import { Button, Card, Group, Image, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import Link from 'next/link';
import { AddCategoryForm } from './components/AddCategoryForm';

export default function EditCategories() {
  const { data: { response: { items } = { items: [] } } = {}, isLoading } =
    trpc.category.listCategories.useQuery(undefined, {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
    });
  const queryClient = useQueryClient();
  const categories: Category[] = items;

  const deleteCategoryMutation = trpc.category.deleteCategory.useMutation();

  const openDeleteCategoryModal = (categoryid: string) =>
    modals.openConfirmModal({
      title: 'Please Confirm Deletion',
      children: (
        <Text size="sm">
          This action will permanently delete the selected category. Are you sure you want to
          proceed?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        const deletingCategoryNotificationId = notifications.show({
          loading: true,
          title: 'Deleting Category',
          message: 'Deleting the category...',
          color: 'yellow',
        });

        deleteCategoryMutation.mutate(
          { categoryid: Number(categoryid) },
          {
            onSuccess: () => {
              notifications.update({
                id: deletingCategoryNotificationId,
                loading: false,
                title: 'Category Deleted Successfully',
                message: 'The category has been deleted successfully.',
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
                id: deletingCategoryNotificationId,
                loading: false,
                title: 'Failed to Delete Category',
                message: 'An error occurred while deleting the category. Please try again later.',
                autoClose: 2000,
                color: 'red',
              });
            },
            onSettled: () => {
              modals.closeAll();
            },
          }
        );
      },
    });

  return (
    <Stack>
      <Title order={3} fw={700}>
        Manage Food Categories
      </Title>
      <Title order={4} c="dimmed">
        Add and Remove Food Categories
      </Title>
      <Button
        onClick={() => {
          modals.open({
            title: 'Add Category',
            children: <AddCategoryForm />,
          });
        }}
        w={200}
      >
        <Group>
          <IconPlus size={18} />
          <Text>Add new</Text>
        </Group>
      </Button>
      <Stack>
        {isLoading ? (
          <div>Loading...</div>
        ) : categories.length === 0 ? (
          <div>No categories found. Create a new one.</div>
        ) : (
          categories.map((category, index: number) => (
            <Card
              key={index}
              withBorder
              p="lg"
              shadow="xs"
              radius="lg"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Stack justify="space-between" w="100%">
                <Text size="lg" fw={700}>
                  {category.name}
                </Text>
                <Text>{category.description}</Text>
                {category.image && (
                  <Image
                    style={{ height: '200px', width: '200px' }}
                    height={200}
                    width={200}
                    src={category.image}
                    alt={`Image of ${category.name}`}
                    onLoad={(e) => {
                      // @ts-ignore
                      e.target.style.display = 'block';
                    }}
                    onError={(e) => {
                      // @ts-ignore
                      e.target.style.display = 'none';
                    }}
                  ></Image>
                )}
                <Group>
                  {' '}
                  <Button
                    onClick={() => {
                      openDeleteCategoryModal(category.categoryid);
                    }}
                    w={200}
                  >
                    <Group>
                      <IconTrash size={18} />
                      <Text>Delete</Text>
                    </Group>
                  </Button>
                  <Link href={`/admin/edit_menu/${category.slug}`}>
                    <Button w={200}>
                      <Group>
                        <IconEdit size={18} />
                        <Text>Edit Items</Text>
                      </Group>
                    </Button>
                  </Link>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}
