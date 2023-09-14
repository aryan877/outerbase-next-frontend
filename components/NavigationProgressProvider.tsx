'use client';
import { useMantineTheme } from '@mantine/core';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React, { ReactNode } from 'react';

interface NavigationProviderProps {
  children: ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const { colors } = useMantineTheme();

  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color={colors.gray[4]}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NavigationProvider;
