'use client';
import { Flex, Image, SimpleGrid } from '@mantine/core';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SimpleGrid cols={2}>
      <Flex justify="center" align="center">
        {children}
      </Flex>
      <Image style={{ width: '100%', height: '100vh', objectFit: 'contain' }} src="/landing.jpg" />
    </SimpleGrid>
  );
}
