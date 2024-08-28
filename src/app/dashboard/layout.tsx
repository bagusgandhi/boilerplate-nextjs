import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Spin } from "antd";
import { Suspense } from "react";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>
        <Suspense fallback={<Spin />}>{children}</Suspense>
      </DashboardLayout>
    </>
  );
}

export default Layout;
