"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
// import { MaintenanceListContext } from "../Pages/List/Index";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { MaintenanceLogContext } from "../Pages/Index";
import { render } from "react-dom";
import moment from "moment";

export default function TableListMaintenanceLog() {
  const {
    state: [state, dispatch],
    resTable,
  }: any = useContext(MaintenanceLogContext);

  // const canUpdateUser = useHasPermission({
  //   requiredPermission: ["userManagement.updateUser"],
  //   session,
  // });

  // const canDeleteUser = useHasPermission({
  //   requiredPermission: ["userManagement.deleteUser"],
  //   session,
  // });

  // const deleteUser = useSWRMutationFetcher({
  //   key: [`delete:api/user`],
  //   axiosOptions: {
  //     method: "DELETE",
  //     url: `api/user/${state.userId}`,
  //   },
  //   swrOptions: {
  //     onSuccess: (data: any) => {
  //       notification["success"]({
  //         message: "Success",
  //         description: "User has been deleted",
  //       });
  //     },
  //   },
  // });

  // const { data: dataRoles, isLoading: isLoadingRoles } = useSWRFetcher<any>({
  //   key: [`api/role?viewAll=true`],
  //   axiosOptions: {
  //     url: "api/role",
  //     params: {
  //       viewAll: true,
  //     },
  //   },
  // });



  const columns = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (text: any, record: any, index: number) =>
        state.pagination.limit * (state.pagination.page - 1) + index + 1,
    },
    {
      title: "Asset / Sparepart",
      dataIndex: "asset_type",
      key: "asset_type",
    },
    {
      title: "ID",
      dataIndex: ["asset", "name"],
      key: "asset",
      render: (text: any, record: any, index: any) => {
        return text ?? "-"
      }
    },
    {
      title: "Phase",
      dataIndex: ["flow", "name"],
      key: "phase",
      render: (text: any, record: any, index: any) => {
        return text ?? "-"
      }
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "DATE",
      render: (text: any, record: any, index: any) => {
        return moment(text).format('DD/MM/YYYY HH:mm:ss') ?? "-"
      }
    },
    {
      title: "Parameter",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any, record: any, index: any) => {
        // return record?.[0]?.name ?? "-";
        return (
          <>
            {record?.paramsValue ? (
              <div className="flex gap-2">
                {Object.entries(record?.paramsValue).map(([key, value]: any) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            ) : "-"}
          </>
        );
      },
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text: any, record: any, index: any) => {
        const logData = JSON.stringify(record, null, 2); // Convert the record to a readable JSON string
        return (
          <div
            style={{
              maxHeight: "150px", // Set max height for scrollable container
              overflowY: "auto", // Enable vertical scrolling
              overflowX: "auto", // Enable horizontal scrolling
              backgroundColor: "#f9f9f9", // Optional: add background for better readability
              padding: "8px", // Optional: add padding
              border: "1px solid #ddd", // Optional: border for better visibility
              borderRadius: "4px", // Optional: rounded corners
            }}
          >
            <pre style={{ margin: 0 }}>{logData}</pre> {/* Preserve formatting */}
          </div>
        );
      }
    },
  ];


  const dataSource = resTable?.data?.results?.map((item: any) => ({
    ...item,
    key: item.id,
  })) 

  return (
    <>
      <Spin size="large" 
        spinning={resTable?.isLoading || resTable?.isValidating}
      >
        <Table
          dataSource={dataSource ?? []}
          columns={columns}
          pagination={{
            current: state.pagination.page,
            pageSize: state.pagination.limit,
            total: resTable?.data?.total,
            position: ["none", "bottomCenter"],
            onChange: (page, pageSize) => {
              dispatch({
                type: "set pagination",
                payload: {
                  limit: pageSize,
                  page,
                },
              });
            },
          }}
        />
      </Spin>
    </>
  );
}
