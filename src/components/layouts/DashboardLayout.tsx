"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Layout, Breadcrumb, Menu, Button, ConfigProvider, Flex } from "antd";
import type { MenuProps } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?: string,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: path ? <Link href={path}>{label}</Link> : label,
  } as MenuItem;
}

// const canViewListUser = useHasPermission({
//   requiredPermission: ["userManagement.viewListOfUser"],
//   session,
// });

const items: MenuItem[] = [
  getItem("Dashboard", "/dashboard", <PieChartOutlined />, "/dashboard"),
  getItem(
    "Sparepart Management",
    "/dashboard/sparepart-management",
    <PieChartOutlined />,
    "/dashboard/sparepart-management"
  ),
  getItem(
    "Maintenance",
    "/dashboard/maintenance",
    <PieChartOutlined />,
    "/dashboard/maintenance"
  ),
  getItem(
    "Flow Management",
    "/dashboard/flow-management",
    <PieChartOutlined />,
    "/dashboard/flow-management"
  ),
  getItem("History Log", "/nphistory-log", <UserOutlined />, undefined, [
    getItem(
      "Maintenance",
      "/history-log/maintenance",
      undefined,
      "/history-log/maintenance"
    ),
    getItem(
      "Activity",
      "/history-log/activity",
      undefined,
      "/history-log/activity"
    ),
  ]),
  getItem("Manage Users", "/npmmanage-users", <UserOutlined />, undefined, [
    getItem(
      "User",
      "/dashboard/manage-users",
      undefined,
      "/dashboard/manage-users"
    ),
    getItem(
      "Role",
      "/dashboard/manage-users/role",
      undefined,
      "/dashboard/manage-users/role"
    ),
    getItem(
      "Permission",
      "/dashboard/manage-users/permission",
      undefined,
      "/dashboard/manage-users/permission"
    ),
  ]),
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  // const { data: session, status } = useSession()

  // console.log(pathname)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4942E4",
        },
        components: {
          Button: {
            colorPrimary: "#ED6B23",
            algorithm: true, // Enable algorithm
          },
          Input: {
            colorPrimary: "#ED6B23",
            algorithm: true, // Enable algorithm
          },
          Steps: {
            colorPrimary: "#ED6B23",
            algorithm: true, // Enable algorithm
          },
        },
      }}
    >
      <Layout>
        {/* header */}
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            zIndex: 100,
            background: "#2D2A70",
            height: 50,
          }}
        >
          <div className="w-full px-4 flex justify-between">
            <div>
              <p className="w-full text-lg font-bold py-4 text-center text-white">
                Inventory KAI{" "}
              </p>
            </div>

            <div>
              <Button
                onClick={() => signOut()}
                className="!py-2 !px-4 block !h-fit !bg-red-500"
                danger
              >
                <span className="!flex items-center justify-center !text-white text-sm">
                  Log Out
                </span>
              </Button>
            </div>
          </div>
        </Header>

        <Layout style={{ minHeight: "100vh" }}>
          {/* sidebar */}
          <div
            style={{
              borderRight: "1px solid #ddd",
            }}
          >
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              theme="light"
              style={{
                background: "#ffffff",
                position: "fixed",
                height: "100vh",
                overflow: "hidden",
                left: 0,
                top: 50,
                bottom: 0,
              }}
            >
              <Menu
                style={{ background: "#ffffff", borderRight: "0px" }}
                theme="light"
                defaultSelectedKeys={[pathname]}
                mode="inline"
                items={items}
              />
            </Sider>
          </div>

          {/* content */}
          <Layout
            style={{
              background: "#f9f9f9",
              marginTop: 50,
              marginLeft: `${collapsed ? 80 : 200}px`,
              // padding: "0 24px"
            }}
          >
            <Content>
              <div className="flex flex-col">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
