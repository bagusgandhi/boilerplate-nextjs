import React from "react";
// import StepperContent from '@/components/Maintenance/Pages/Details/Index';
import { Breadcrumb } from "antd";
import Title from "antd/es/typography/Title";
import MaintenanceAdd from "@/components/Maintenance/Pages/Index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-white border-b-2 border-gray-100 px-4 py-2">
        <Breadcrumb
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Tab Maintenance", href: "/dashboard/maintenance" },
            { title: "Details" },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Title level={4}>Detail Maintenance</Title>
      </div>

      <div className="px-8">
        {/* <StepperContent id={params.id} withHeader={true}/> */}
        <MaintenanceAdd session={session} id={params.id} />
      </div>
    </>
  );
}
