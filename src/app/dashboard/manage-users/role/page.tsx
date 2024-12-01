import Title from "antd/es/typography/Title";
import React from "react";
import ManageRoles from "@/components/ManageUsers/Pages/Roles/Index";
import { getServerSession } from "next-auth";
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
            { title: "Manage Users", href: "/dashboard/manage-users" },
            { title: "Role", href: "/dashboard/manage-users/role" }
          ]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Manage Role</Title>
      </div>

      <div className="px-8">
        <ManageRoles session={session}/>
      </div>
    </>
  );
}
