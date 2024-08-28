import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Spin } from "antd";
import { Suspense } from "react";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<Spin />}>{children}</Suspense>
    </div>
  );
}

export default Layout;
