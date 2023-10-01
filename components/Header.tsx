'use client';
import { trpc } from '@/app/_trpc/client';
import { CartItem } from '@/types/types';
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {
  Burger,
  Flex,
  Group,
  MantineColorScheme,
  Select,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

function Header({ toggle, opened }: { toggle: () => void; opened: boolean }) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const [value, setValue] = useState('auto');
  const appearance = {
    ...(computedColorScheme === 'dark' ? { baseTheme: dark } : {}),
  };

  const {
    data: { response: { items: cartItems } = { items: [] } } = {},
    isLoading: isLoadingCartItems,
  } = trpc.cart.getCartItems.useQuery(undefined, {
    // staleTime: 10 * (60 * 1000), // 10 mins
    // cacheTime: 15 * (60 * 1000), // 15 mins
  });

  const myCartItems: CartItem[] = cartItems;

  const totalQuantity = myCartItems.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);

  return (
    <Flex justify="space-between" h="100%" align="center" p="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Flex justify="space-between" gap="md" align="center">
        <Text
          variant="gradient"
          gradient={{ from: 'primary.6', to: 'primary.3', deg: 45 }}
          ta="center"
          fz="xl"
          fw={700}
        >
          {process.env.NEXT_PUBLIC_RESTAURANT_NAME}
        </Text>
      </Flex>
      <Flex
        gap="md"
        align="center"
        style={{
          position: 'relative',
        }}
      >
        <Select
          data={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ]}
          value={value}
          onChange={(value) => {
            setValue(value || 'auto');
            setColorScheme((value as MantineColorScheme) || 'auto');
          }}
          defaultValue="auto"
          placeholder="Select Mode"
          style={{ minWidth: 150 }}
        />

        <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group>
            <IconShoppingCart />
            <Text>Cart ({totalQuantity})</Text>
          </Group>
        </Link>
        <UserButton afterSignOutUrl="/sign-in" appearance={appearance} />
      </Flex>
    </Flex>
  );
}

export default Header;
