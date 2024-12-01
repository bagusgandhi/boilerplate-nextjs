"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
import { ManageAssetContext } from "../Pages/Index";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function TableListAssets({ handlersModal }: any) {
  const {
    state: [state, dispatch],
    resTable,
    session
  }: any = useContext(ManageAssetContext);

  const canUpdateAsset = useHasPermission({
    requiredPermission: ["assetManagement.updateUser"],
    session,
  });

  const canDeleteAsset = useHasPermission({
    requiredPermission: ["assetManagement.deleteUser"],
    session,
  });

  const deleteAsset = useSWRMutationFetcher({
    key: [`delete:api/asset`],
    axiosOptions: {
      method: "DELETE",
      url: `api/asset/${state.userId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "User has been deleted",
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      width: 400,

      render: (record: any) => {
        return (
          <div className="flex gap-2">
            {canUpdateAsset &&(<Button
              onClick={() => {
                dispatch({
                  type: "set formType",
                  payload: "edit",
                });
                dispatch({
                  type: "set userId",
                  payload: record.id,
                });
                handlersModal.open();
              }}
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>)}
            {canDeleteAsset && (<Popconfirm
              placement="bottom"
              title={"Warning"}
              description={'Are you sure to delete "' + record.name + '" ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteAsset.trigger();
                await resTable.mutate();
              }}
            >
              <Button
                onClick={() => {
                  dispatch({
                    type: "set userId",
                    payload: record.id,
                  });
                }}
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>)}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    resTable.mutate();
  }, [state.filter.roleId]);

  return (
    <>
      <Spin size="large" spinning={resTable?.isLoading}>
        <Table
          dataSource={resTable?.data?.results?.map((item: any) => ({
            ...item,
            key: item.id,
          }))}
          columns={columns}
          onChange={(pagination, filters, sorter, extra) => {
            dispatch({
              type: "set filter.roleId",
              payload: filters.roles
            });

          }}
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
