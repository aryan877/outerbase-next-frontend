'use client';
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {
  Burger,
  Card,
  Flex,
  Indicator,
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

  return (
    <Flex justify="space-between" h="100%" align="center" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Flex justify="space-between" gap="md" align="center">
        <Text
          variant="gradient"
          gradient={{ from: 'primary.6', to: 'primary.3', deg: 45 }}
          ta="center"
          fz="xl"
          fw={700}
        >
          Bloomfoods
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

        <Link href="/cart">
          <Indicator label={'0'}>
            <Card
              withBorder
              p={6}
              style={{ cursor: 'pointer' }}
              // bg={computedColorScheme === 'dark' ? theme.colors.dark[4] : theme.primaryColor}
              // size="xl"
              aria-label="Cart icon"
            >
              <IconShoppingCart />
            </Card>
          </Indicator>
        </Link>
        <UserButton afterSignOutUrl="/sign-in" appearance={appearance} />
      </Flex>
    </Flex>
  );
}

export default Header;
