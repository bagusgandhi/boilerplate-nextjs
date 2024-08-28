import React from "react";
import Title from "antd/es/typography/Title";
import ManageUser from "@/components/ManageUsers/Pages/Users/Index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Title level={4}>Manage Users</Title>
      <ManageUser session={session}/>
    </>
  );
}
