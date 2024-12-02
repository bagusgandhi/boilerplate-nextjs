import React from 'react'
import StepperContent from '@/components/Maintenance/StepperContent/Index';
import { Breadcrumb } from 'antd';
import Title from 'antd/es/typography/Title';

export default function page({ params }: { params: { id: string }}) {
  
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
        <StepperContent id={params.id} />
      </div>
    </>
  )
}