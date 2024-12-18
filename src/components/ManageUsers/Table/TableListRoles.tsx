"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext } from "react";
import { ManageRolesContext } from "../Pages/Roles/Index";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function TableListRoles({ handlersModal }: any) {
  const {
    state: [state, dispatch],
    resTable,
    session
  }: any = useContext(ManageRolesContext);

  const canUpdateRole = useHasPermission({
    requiredPermission: ["userManagement.updateRole"],
    session,
  });

  const canDeleteRole = useHasPermission({
    requiredPermission: ["userManagement.deleteRole"],
    session,
  });


  const deleteRole = useSWRMutationFetcher({
    key: [`delete:api/role`],
    axiosOptions: {
      method: "DELETE",
      url: `api/role/${state.roleId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Role has been deleted",
        });
      },
    },
  });

  const columns = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (text: any, record: any, index: number) =>
        state.pagination.limit * (state.pagination.page - 1) + index + 1,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      width: 400,
      render: (record: any) => {
        return (
          <div className="flex gap-2">
            { canUpdateRole && (<Button
              onClick={() => {
                dispatch({
                  type: "set formType",
                  payload: "edit",
                });
                dispatch({
                  type: "set roleId",
                  payload: record.id,
                });
                handlersModal.open();
              }}
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>)}
            { canDeleteRole && (<Popconfirm
              placement="bottom"
              title={"Warning"}
              description={'Are you sure to delete "' + record.name + '" ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteRole.trigger();
                await resTable.mutate();
              }}
            >
              <Button
                onClick={() => {
                  dispatch({
                    type: "set roleId",
                    payload: record.id,
                  });
                }} danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>)}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Spin size="large" spinning={resTable?.isLoading}>
        <Table
          dataSource={resTable?.data?.results?.map((item: any) => ({
            ...item,
            key: item.id,
          }))}
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
