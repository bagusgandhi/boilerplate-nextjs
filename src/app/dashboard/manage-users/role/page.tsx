import Title from "antd/es/typography/Title";
import React from "react";
import ManageRoles from "@/components/ManageUsers/Pages/Roles/Index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Title level={4}>Manage Role</Title>
      <ManageRoles session={session}/>
    </>
  );
}
