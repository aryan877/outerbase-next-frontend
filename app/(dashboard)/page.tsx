'use client';
import { Category } from '@/types/types';
import { Card, Group, Image, Stack, Text, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { trpc } from '../_trpc/client';

export default function FoodDeliveryPage() {
  const theme = useMantineTheme();

  const { data: { response: { items } = { items: [] } } = {}, isLoading } =
    trpc.category.listCategories.useQuery(undefined, {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
    });

  const categories: Category[] = items;

  return (
    <Stack>
      <Text size="xl" fw={700}>
        Explore Our Delicious Food Categories
      </Text>
      <Stack>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          categories.map((category, index: number) => (
            <Link
              key={index}
              href={`/category/${category.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <Card
                withBorder
                p="lg"
                // bg={theme.primaryColor}
                shadow="xs"
                radius="md"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Group justify="space-between" w="100%">
                  <Text size="lg" fw={700} style={{ color: 'white' }}>
                    {category.name}
                  </Text>
                  <Image
                    style={{ height: '200px', width: '200px' }}
                    height={200}
                    width={200}
                    src={category.image}
                  ></Image>
                </Group>
              </Card>
            </Link>
          ))
        )}
      </Stack>
    </Stack>
  );
}
