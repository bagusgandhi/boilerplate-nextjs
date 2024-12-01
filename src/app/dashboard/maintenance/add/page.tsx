import { authOptions } from "@/lib/authOptions";
import { Breadcrumb } from "antd";
import { getServerSession } from "next-auth";
import React from "react";
import Title from "antd/es/typography/Title";
import MaintenanceAdd from "@/components/Maintenance/Pages/Add/Index";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-white border-b-2 border-gray-100 px-4 py-2">
        <Breadcrumb
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Tab Maintenance", href: "/dashboard/maintenance" },
            { title: "Add", href: "/dashboard/maintenance/add" },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Tambah Data</Title>
      </div>

      <div className="px-8">
          <MaintenanceAdd session={session} />
      </div>
    </>
  );
}
