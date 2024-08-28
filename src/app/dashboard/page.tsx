import { getServerSession } from "next-auth/next";
import React from "react";
import { authOptions } from "@/lib/authOptions";
import Title from "antd/es/typography/Title";
import Test from "@/components/Test";

export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Title level={4}>Dashboard</Title>
      <Test />
    </div>
  );
}
