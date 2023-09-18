'use client';
import { trpc } from '@/app/_trpc/client';
import { FoodItem } from '@/types/types';
import { Button, Card, Group, Image, NumberInput, Stack, Text } from '@mantine/core';
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

  const fooditems: FoodItem[] = items;

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
                <Button>Add</Button>
              </Stack>
            </Group>
          </Card>
        ))
      )}
    </Stack>
  );
}

export default page;
