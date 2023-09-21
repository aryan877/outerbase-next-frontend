'use client';
import { useEffect } from 'react';
import Confetti from 'react-dom-confetti';

function Page() {
  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    colors: ['#ff0000', '#00ff00', '#0000ff'], // Customize the confetti colors
  };

  // Set a timer to trigger confetti after a delay
  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      // You can trigger the confetti animation here
      clearTimeout(confettiTimer);
    }, 1000); // Delay in milliseconds before confetti starts

    // Cleanup the timer on unmount
    return () => clearTimeout(confettiTimer);
  }, []);

  return (
    <div>
      <h1>Success!!</h1>
      {/* Add Confetti component */}
      <Confetti active={true} config={confettiConfig} />
    </div>
  );
}

export default Page;
