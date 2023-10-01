// FoodItemCard.tsx
import { trpc } from '@/app/_trpc/client';
import { FoodItem } from '@/types/types'; // Import the types
import { Button, Card, Group, Image, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useState } from 'react';

interface FoodItemCardProps {
  fooditem: FoodItem;
}

function FoodItemCard({ fooditem }: FoodItemCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const queryClient = useQueryClient();

  const deleteItemMutation = trpc.category.deleteCategoryItem.useMutation();

  const openDeleteFoodItemModal = () =>
    modals.openConfirmModal({
      title: 'Please Confirm Deletion',
      children: (
        <Text size="sm">
          This action will permanently delete the selected food item. Are you sure you want to
          proceed?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        const deletingFoodItemNotificationId = notifications.show({
          loading: true,
          title: 'Deleting Food Item',
          message: 'Deleting the food item...',
          color: 'yellow',
        });

        deleteItemMutation.mutate(
          { fooditemid: Number(fooditem.itemid) },
          {
            onSuccess: () => {
              notifications.update({
                id: deletingFoodItemNotificationId,
                loading: false,
                title: 'Food Item Deleted Successfully',
                message: 'The food item has been deleted successfully.',
                autoClose: 2000,
                color: 'green',
              });

              const listFoodItemsQueryKey = getQueryKey(
                trpc.category.listCategoryItems,
                undefined,
                'query'
              );
              queryClient.refetchQueries(listFoodItemsQueryKey);
            },
            onError: () => {
              notifications.update({
                id: deletingFoodItemNotificationId,
                loading: false,
                title: 'Failed to Delete Food Item',
                message: 'An error occurred while deleting the food item. Please try again later.',
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
    <Card withBorder shadow="xs" radius="lg" style={{ cursor: 'pointer' }}>
      <Group gap="md" align="start">
        {fooditem.image && (
          <Image
            height={200}
            width={200}
            style={{
              height: '200px',
              width: '200px',
              display: imageLoaded ? 'block' : 'none',
            }}
            src={fooditem.image}
            alt={fooditem.name}
            onLoad={() => {
              setImageLoaded(true);
            }}
            onError={() => {
              setImageLoaded(false);
            }}
          />
        )}

        <Stack>
          <Text size="lg" fw={700}>
            {fooditem.name}
          </Text>
          <Text size="md">
            {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
            {fooditem.price}
          </Text>
          <Button w={200} onClick={openDeleteFoodItemModal}>
            <Group>
              <IconTrash size={18} />
              <Text>Delete</Text>
            </Group>
          </Button>
        </Stack>
      </Group>
    </Card>
  );
}

export default FoodItemCard;
