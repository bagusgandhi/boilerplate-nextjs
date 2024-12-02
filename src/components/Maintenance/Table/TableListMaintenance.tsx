"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
import { MaintenanceListContext } from "../Pages/List/Index";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function TableListMaintenance({ handlersModal }: any) {
  const {
    state: [state, dispatch],
    resMaintenance,
    session,
  }: any = useContext(MaintenanceListContext);

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

  // const filterRole: any[] = dataRoles?.map((role: any) => ({
  //   text: role.name,
  //   value: role.id,
  // }));

  // console.log(resMaintenance);

  const columns = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (text: any, record: any, index: number) =>
        state.pagination.limit * (state.pagination.page - 1) + index + 1,
    },
    {
      title: "Spare Part",
      dataIndex: ["asset", "asset_type"],
      key: "asset_type",
    },
    {
      title: "ID",
      dataIndex: ["asset", "name"],
      key: "name",
    },
    {
      title: "Phase",
      dataIndex: ["flow", "name"],
      key: "flow",
    },
    {
      title: "Action",
      key: "action",
      width: 400,

      render: (record: any) => {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                console.log(record?.asset?.id);
              }}
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Popconfirm
              placement="bottom"
              title={"Warning"}
              description={'Are you sure to delete this maintenance ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                console.log(record?.asset?.id);
              }}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // useEffect(() => {
  //   resTable.mutate();
  // }, [state.filter.roleId]);

  return (
    <>
      <Spin size="large" spinning={resMaintenance?.isLoading}>
        <Table
          dataSource={
            resMaintenance?.data?.results?.map((item: any) => ({
              ...item,
              key: item.id,
            })) ?? []
          }
          columns={columns}
          pagination={{
            current: state.pagination.page,
            pageSize: state.pagination.limit,
            total: resMaintenance?.data?.total,
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
