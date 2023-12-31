'use client';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Stack, Text, useMantineColorScheme } from '@mantine/core';

export default function Page() {
  const { colorScheme } = useMantineColorScheme();
  const appearance = {
    ...(colorScheme === 'dark' ? { baseTheme: dark } : {}),
  };
  return (
    <Stack>
      <Text size="xl" variant="gradient" gradient={{ from: 'primary.6', to: 'primary.3', deg: 45 }}>
        Sign up for {process.env.NEXT_PUBLIC_RESTAURANT_NAME}
      </Text>
      <SignUp appearance={appearance} />
    </Stack>
  );
}
