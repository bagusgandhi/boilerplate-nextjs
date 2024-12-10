"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Layout,
  Breadcrumb,
  Menu,
  Button,
  ConfigProvider,
  Flex,
  Dropdown,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import {
  ApiOutlined,
  AreaChartOutlined,
  DesktopOutlined,
  DownOutlined,
  FileOutlined,
  HistoryOutlined,
  PartitionOutlined,
  PieChartOutlined,
  SnippetsOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  UsergroupAddOutlined,
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
  getItem("Dashboard", "/dashboard", <AreaChartOutlined />, "/dashboard"),
  getItem(
    "Maintenance",
    "/dashboard/maintenance",
    <ToolOutlined />,
    "/dashboard/maintenance"
  ),
  getItem(
    "Sparepart Management",
    "/dashboard/sparepart-management",
    <TableOutlined />,
    "/dashboard/sparepart-management"
  ),
  getItem(
    "Asset Management",
    "/dashboard/asset-management",
    <SnippetsOutlined />,
    "/dashboard/asset-management"
  ),
  getItem(
    "Daftar Perakitan",
    "/dashboard/perakitan",
    <ApiOutlined />,
    "/dashboard/perakitan",
  ),
  // getItem(
  //   "Flow Management",
  //   "/dashboard/flow-management",
  //   <PartitionOutlined />,
  //   "/dashboard/flow-management"
  // ),
  getItem("History", "/nphistory", <HistoryOutlined />, undefined, [
    getItem(
      "Maintenance Log",
      "/dashboard/history/maintenance-log",
      undefined,
      "/dashboard/history/maintenance-log"
    ),
    // getItem(
    //   "Activity Log",
    //   "/dashboard/history/activity-log",
    //   undefined,
    //   "/dashboard/history/activity-log"
    // ),
  ]),
  getItem(
    "Manage Users",
    "/npmmanage-users",
    <UsergroupAddOutlined />,
    undefined,
    [
      getItem(
        "User",
        "/dashboard/manage-users",
        undefined,
        "/dashboard/manage-users"
      ),
      // getItem(
      //   "Role",
      //   "/dashboard/manage-users/role",
      //   undefined,
      //   "/dashboard/manage-users/role"
      // ),
      // getItem(
      //   "Permission",
      //   "/dashboard/manage-users/permission",
      //   undefined,
      //   "/dashboard/manage-users/permission"
      // ),
    ]
  ),
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const itemsProfile: MenuProps["items"] = [
    {
      label: "Log Out",
      key: "0",
      onClick: () => signOut(),
    },
  ];

  // console.log(session);

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
          Select: {
            colorPrimary: "#ED6B23",
            algorithm: true, // Enable algorithm
          },
          DatePicker: {
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
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <div className="w-full px-4 flex justify-between">
            <div>
              <p className="w-full text-lg font-bold py-4 text-center text-white">
                Inventory KAI{" "}
              </p>
            </div>

            <div>
              <Dropdown
                placement="bottomLeft"
                menu={{ items: itemsProfile }}
                trigger={["click"]}
              >
                <Button
                  icon={
                    <UserOutlined
                      style={{
                        color: "#4942E4",
                        backgroundColor: "#eee",
                        padding: "6px",
                        borderRadius: "50%",
                      }}
                    />
                  }
                  type="text"
                  className="!text-white !hover:text-white cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                >
                  <Space>
                    {session?.user?.name}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
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
                selectedKeys={[pathname]}
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
