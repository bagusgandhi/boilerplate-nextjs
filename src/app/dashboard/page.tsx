import { getServerSession } from "next-auth/next";
import React from "react";
import { authOptions } from "@/lib/authOptions";
import Title from "antd/es/typography/Title";
import { Breadcrumb } from "antd";
import DashboardPage from "@/components/Dashboard/Pages/Index";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-white border-b-2 border-gray-100 px-4 py-2">
        <Breadcrumb
          items={[{ title: "Dashboard", href: "/dashboard" }]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Dashboard</Title>
      </div>

      <div className="px-8">
        <DashboardPage session={session} />
      </div>
    </>
  );
}

