import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId } = auth();
  const stripe_price_id = 'testing';
  if (!userId) {
    return;
  }
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      stripe_price_id: stripe_price_id,
    },
  });
  
  return NextResponse.json({ success: true });
}
