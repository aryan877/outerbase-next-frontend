// FoodItemCard.tsx
import { CartItem, FoodItem } from '@/types/types'; // Import the types
import { Button, Card, Group, Image, NumberInput, Stack, Text } from '@mantine/core';
import { useState } from 'react';

interface FoodItemCardProps {
  fooditem: FoodItem;
  cartItem: CartItem | undefined; // Define the types for fooditem and cartItem
  modifyCartItemsHandler: (id: number, quantity?: number) => void;
}

function FoodItemCard({ fooditem, cartItem, modifyCartItemsHandler }: FoodItemCardProps) {
  const quantity = cartItem ? cartItem.quantity : 0;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card withBorder shadow="xs" radius="lg" style={{ cursor: 'pointer' }}>
      <Group gap="md" align="start">
        <Image
          height={200}
          width={200}
          style={{
            height: '200px',
            width: '200px',
            display: imageLoaded ? 'block' : 'none',
          }}
          src={fooditem.image}
          alt={fooditem.name}
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            setImageLoaded(false);
          }}
        />
        <Stack>
          <Text size="lg" fw={700}>
            {fooditem.name}
          </Text>
          <Text size="md">
            {' '}
            {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}
            {fooditem.price}
          </Text>
          {quantity === 0 ? (
            <Button
              w={200}
              onClick={() => {
                modifyCartItemsHandler(Number(fooditem.itemid), 1);
              }}
            >
              Add
            </Button>
          ) : (
            <NumberInput
              label="Choose Quantity"
              clampBehavior="strict"
              min={0}
              max={100}
              step={1}
              value={quantity}
              allowNegative={false}
              onChange={(value) => {
                modifyCartItemsHandler(Number(fooditem.itemid), Number(value));
              }}
            />
          )}
        </Stack>
      </Group>
    </Card>
  );
}

export default FoodItemCard;
