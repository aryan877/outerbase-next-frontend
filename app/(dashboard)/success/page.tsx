'use client';
import { Center, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

function Page() {
  const [isExploding, setIsExploding] = React.useState(false);

  useEffect(() => {
    // Trigger the explosion animation on initial load
    setIsExploding(true);

    // Set a timeout to stop the animation after 3 seconds (adjust as needed)
    const explosionTimeout = setTimeout(() => {
      setIsExploding(false);
    }, 3000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(explosionTimeout);
  }, []);

  return (
    <>
      {isExploding && (
        <Center>
          <ConfettiExplosion />
        </Center>
      )}
      <Title order={3}>Order Placed Successfully</Title>
    </>
  );
}

export default Page;
