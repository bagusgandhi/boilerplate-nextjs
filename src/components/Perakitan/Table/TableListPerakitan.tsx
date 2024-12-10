"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useContext, useEffect } from "react";
// import { MaintenanceListContext } from "../Pages/List/Index";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { PerakitanListContext } from "../Pages/Index";
// import { SparepartListContext } from "../Pages/Index";

export default function TableListPerakitan({ handlersModal }: any) {
  const {
    state: [state, dispatch],
    resTableTrain,
    deleteSparepart,
    mapParent
  }: any = useContext(PerakitanListContext);

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

  // useEffect(() => {
  //   console.log(state.filter)
  // }, [state.filter]);


  const columnsTrain = [
    {
      title: "ID Asset / Sparepart",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "asset_type",
      key: "asset_type",
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
          record.asset_type !== 'Train Set' &&(<div className="flex gap-2">
            <Button
              onClick={() => {
                dispatch({
                  type: "set assetName",
                  payload: record.name,
                });

                dispatch({
                  type: "set filter.parent_asset_type",
                  payload: mapParent[record.asset_type],
                });

                dispatch({
                  type: "set filter.asset_type",
                  payload: record.asset_type,
                });

                dispatch({
                  type: "set assetId",
                  payload: record.id,
                });

                handlersModal.open();
                // console.log({
                //   id: record.id,
                //   name: record.name,
                //   asset_type: record.asset_type,
                // })

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

                const data: any = {
                  data: {
                    name: record.name,
                    asset_type: record.asset_type,
                    parent_asset_id: null,
                  },
                };

                await deleteSparepart.trigger(data);
                await resTableTrain.mutate();
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
          </div>)
        );
      },
    },
  ];

  const transformDataWithKeys = (data: any[]): any[] => {
    return data.map((item: any) => {
      return {
        ...item,
        key: item.id,
        children: item.children ? transformDataWithKeys(item.children) : [], // Recursively handle children
      };
    });
  }

  const dataSource = transformDataWithKeys(resTableTrain?.data?.results ?? []);

  return (
    <>
      <Spin size="large" 
        spinning={resTableTrain?.isLoading}
      >
        <Table
          dataSource={dataSource ?? []}
          columns={columnsTrain}
          pagination={{
            current: state.pagination.page,
            pageSize: state.pagination.limit,
            total: resTableTrain?.data?.total,
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
