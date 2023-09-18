'use client';
import { useParams } from 'next/navigation';

function page() {
  const { orderid } = useParams();
  return <div>{orderid}</div>;
}

export default page;
