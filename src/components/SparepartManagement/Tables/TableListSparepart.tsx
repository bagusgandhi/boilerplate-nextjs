"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
// import { MaintenanceListContext } from "../Pages/List/Index";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { SparepartListContext } from "../Pages/Index";

export default function TableListSparepart({ handlersModal }: any) {
  const {
    state: [state, dispatch],
    resTable,
    session
  }: any = useContext(SparepartListContext);

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

  const deleteSparepart = useSWRMutationFetcher({
    key: [`delete:api/asset`],
    axiosOptions: {
      method: "DELETE",
      url: `api/asset/${state.assetId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Sparepart has been deleted",
        });
      },
    },
  });

  const AssetTypeOptions = [
    {
      value: "Train Set",
      text: "Train Set",
    },
    {
      value: "Gerbong",
      text: "Gerbong",
    },
    {
      value: "Bogie",
      text: "Bogie",
    },
    {
      value: "Keping Roda",
      text: "Keping Roda",
    },
  ]

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
      dataIndex: "asset_type",
      key: "asset_type",
      filters: AssetTypeOptions,
      filterMultiple: false
    },
    {
      title: "ID",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Parameter",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (record: any) => {
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
      title: "Action",
      key: "action",
      width: 400,

      render: (record: any) => {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                dispatch({
                  type: "set formType",
                  payload: "edit",
                });
                dispatch({
                  type: "set assetId",
                  payload: record.id,
                });
                handlersModal.open();
              }}
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Popconfirm
              placement="bottom"
              title={"Warning"}
              description={'Are you sure to delete "' + record.name + '" ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteSparepart.trigger();
                await resTable.mutate();
              }}
            >
              <Button
                onClick={() => {
                  dispatch({
                    type: "set assetId",
                    payload: record.id,
                  });
                }}
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
            {/* {canUpdateUser &&(<Button
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
            {canDeleteUser && (<Popconfirm
              placement="bottom"
              title={"Warning"}
              description={'Are you sure to delete "' + record.name + '" ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteUser.trigger();
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
            </Popconfirm>)} */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Spin size="large" 
        spinning={resTable?.isLoading}
      >
        <Table
          dataSource={resTable?.data?.results?.map((item: any) => ({
            ...item,
            key: item.id,
          }))}
          columns={columns}
          onChange={(pagination, filters, sorter, extra) => {
            console.log(filters)
            dispatch({
              type: "set filter.asset_type",
              payload: filters.asset_type?.[0]
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
