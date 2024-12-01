import SparepartList from '@/components/SparepartManagement/Pages/Index';
import { authOptions } from '@/lib/authOptions';
import { Breadcrumb } from 'antd'
import Title from "antd/es/typography/Title";
import { getServerSession } from 'next-auth';

import React from 'react'

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-white border-b-2 border-gray-100 px-4 py-2">
        <Breadcrumb
          items={[
            { title: "Dashboard", href: "/dashboard" }, 
            { title: "Sparepart Management", href: "/dashboard/sparepart-management" }]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Sparepart Management</Title>
      </div>

      <div className="px-8">
        <SparepartList session={session} />
      </div>
    </>
  )
}
