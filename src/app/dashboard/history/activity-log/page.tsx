// import ManagePermissions from '@/components/ManageUsers/Pages/Permissions/Index'
import Title from "antd/es/typography/Title";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/lib/authOptions";
import { Breadcrumb } from "antd";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-white border-b-2 border-gray-100 px-4 py-2">
        <Breadcrumb
          items={[
            { title: "Dashboard", href: "/dashboard" }, 
            { title: "History" },
            { title: "Activity Log", href: "/dashboard/history/activity-log" }
          ]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Activity Log</Title>
      </div>
      {/* <ManagePermissions session={session} /> */}
    </>
  );
}
