"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
// import { MaintenanceListContext } from "../Pages/List/Index";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { SparepartListContext } from "../Pages/Index";

export default function TableListSparepart({ handlersModal, isAsset }: any) {
  const {
    state: [state, dispatch],
    resTable,
    resTableSparepart
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
    }
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
      title: isAsset ? "Asset" : "Spare Part",
      dataIndex: "asset_type",
      key: "asset_type",
      filters: isAsset && AssetTypeOptions,
      // filterMultiple: false
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return text ?? "-"
      }
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
                await resTableSparepart.mutate();
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
          </div>
        );
      },
    },
  ];

  const columnsAsset = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (text: any, record: any, index: number) =>
        state.pagination.limit * (state.pagination.page - 1) + index + 1,
    },
    {
      title: "Asset",
      dataIndex: "asset_type",
      key: "asset_type",
      filters: isAsset && AssetTypeOptions,
      // filterMultiple: false
    },
    {
      title: "ID",
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
          </div>
        );
      },
    }
  ];

  const dataSource = isAsset ?
  resTable?.data?.results?.map((item: any) => ({
    ...item,
    key: item.id,
  })) 
  : resTableSparepart.data?.results?.map((item: any) => ({
    ...item,
    key: item.id,
  }))

  return (
    <>
      <Spin size="large" 
        spinning={resTable?.isLoading || resTable?.isValidating || resTableSparepart?.isLoading || resTableSparepart?.isValidating}
      >
        <Table
          dataSource={dataSource ?? []}
          columns={ isAsset ? columnsAsset : columns}
          onChange={(pagination, filters, sorter, extra) => {
            dispatch({
              type: "set filter.asset_types",
              payload: filters.asset_type
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
