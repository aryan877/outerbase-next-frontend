'use client';
import { Category } from '@/types/types';
import { Card, Image, Stack, Text, Title, useMantineTheme } from '@mantine/core';
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
      <Title order={3} fw={700}>
        Explore Our Delicious Food Categories
      </Title>
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
                radius="lg"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Stack justify="space-between" w="100%">
                  <Text size="lg" fw={700}>
                    {category.name}
                  </Text>
                  <Text>{category.description}</Text>
                  <Image
                    style={{ height: '200px', width: '200px' }}
                    height={200}
                    width={200}
                    src={category.image}
                  ></Image>
                </Stack>
              </Card>
            </Link>
          ))
        )}
      </Stack>
    </Stack>
  );
}
