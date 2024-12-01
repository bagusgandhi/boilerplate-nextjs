// import ManagePermissions from '@/components/ManageUsers/Pages/Permissions/Index'
import Title from 'antd/es/typography/Title'
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from "@/lib/authOptions";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Title level={4}>Asset Management</Title>
      {/* <ManagePermissions session={session} /> */}
    </>
  )
}
