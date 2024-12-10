"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Select, Spin, Steps, notification } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useRouter } from "next/navigation";
import StepperContentAdd from "@/components/Maintenance/StepperContent/StepperContentAdd";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { flowMap } from "@/utils/const/flowMap";

export default function Maintenance({ session, id }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [form] = Form.useForm();
  const router = useRouter();

  const resMaintenanceDetail = useSWRFetcher<any>({
    key: id && [`api/maintenance/${id}`],
  });

  useEffect(() => {
    if (resMaintenanceDetail?.data) {
      dispatch({
        type: "set stepperStats",
        payload: flowMap[resMaintenanceDetail?.data?.flow?.name],
      });

      dispatch({
        type: "set filter.assetId",
        payload: resMaintenanceDetail?.data?.asset?.id,
      });
    }
  }, [resMaintenanceDetail?.data]);

  const resFlow = useSWRFetcher<any>({
    key: [`api/flow`],
    axiosOptions: {
      params: {
        order: "position:ASC",
      },
    },
  });

  const resAsset = useSWRFetcher<any>({
    key: {
      url: "api/asset",
      params: {
        viewAll: true,
        asset_type: "Gerbong",
        is_maintenance: false,
      },
    },
    // key: [`api/asset`],
    // axiosOptions: {
    //   params: {
    //     viewAll: true,
    //     asset_type: "Gerbong",
    //     is_maintenance: false,
    //   },
    // },
  });

  const swapAsset = useSWRMutationFetcher({
    key: [`create:api/asset/swap`],
    axiosOptions: {
      method: "POST",
      url: `api/asset/swap`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Swap Asset has been update",
        });
      },
    },
  });

  const updateAsset = useSWRMutationFetcher({
    key: [`update:api/asset`],
    axiosOptions: {
      method: "PATCH",
      url: `api/asset/${state.selectedAssetId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Swap Asset has been update",
        });
      },
    },
  });

  const resAssetDetail = useSWRFetcher<any>({
    key: state.filter.assetId && [`api/asset/${state.filter.assetId}`],
  });

  // let dataSource = resAssetDetail.data?.children
  //   ?.flatMap((item: any) => item.children)
  //   .map(({ children, ...rest }: any) => ({ key: rest.id, ...rest }));

  // // const defaultSelectedRowKeys = dataSource?.filter((item: any) => item.status === "active")
  // // .map((item: any) => item.key);
  // // console.log(dataSource)

  // // const rowSelection = {
  // //   selectedRowKeys: defaultSelectedRowKeys,
  // // getCheckboxProps: (record: any) => ({
  // //   disabled: true, // Disable the checkbox for all rows (no interaction)
  // // }),
  // // };

  // console.log("flatMap", resAssetDetail.data?.children?.flatMap((item: any) => item.children));

  useEffect(() => {
    resAsset.mutate();
  }, [state.filter]);

  const stepperItem = resFlow?.data?.results?.map((item: any) => ({
    title: item.name,
    description: item.description,
  }));

  return (
    <>
      <MaintenanceAddContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resAssetDetail,
          swapAsset,
          updateAsset,
        }}
      >
        <Spin
          size="large"
          spinning={resFlow?.isLoading || resAssetDetail.isLoading}
        >
          <div className="flex flex-col gap-8 bg-white p-8 mt-6">
            {/* step info */}
            <Steps
              type="default"
              current={state.stepperStats}
              items={stepperItem ?? []}
            />

            {/* form search */}
            {!id && state.stepperStats === 0 && (
              <Form
                layout="horizontal"
                form={form}
                onFinish={(value) => {
                  dispatch({
                    type: "set filter.assetId",
                    payload: value.search,
                  });
                }}
              >
                <Flex align="center" justify="space-between" gap={10}>
                  <Form.Item
                    label="Pencarian"
                    name="search"
                    style={{ flex: 1, width: "100%" }}
                  >
                    {/* <Input type="text" placeholder="Masukan ID Gerbong" /> */}
                    <Select
                      showSearch
                      allowClear
                      loading={resAsset?.isLoading}
                      placeholder="Masukan ID Gerbong"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={resAsset?.data?.results?.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      onChange={(value: any) => {
                        if (value) {
                          form.setFieldsValue({ search: value });
                          localStorage.setItem("assetId", value);
                        } else {
                          form.setFieldsValue({ search: undefined });
                          localStorage.setItem("assetId", "");
                          dispatch({
                            type: "set filter.assetId",
                            payload: undefined,
                          });
                        }
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={resAssetDetail?.isLoading}
                      htmlType="submit"
                      icon={<SearchOutlined />}
                    >
                      Cek ID
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      icon={<PlusOutlined />}
                      disabled={resAssetDetail?.isLoading}
                      type="primary"
                      onClick={() => router.push("/dashboard/asset-management")}
                    >
                      Daftar Data Baru
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            )}

            <StepperContentAdd />
          </div>
        </Spin>
      </MaintenanceAddContext.Provider>
    </>
  );
}

export const MaintenanceAddContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  stepperStats: number;
  filter: {
    assetId: string | undefined;
    flow: string | undefined;
  };
  isSaved?: boolean;
  showSaveButton?: boolean;
  selectedAssetId: string | undefined;
  selectedParentAssetId: string | undefined;
  paramsValue: Record<string, any> | undefined;
  selectedAssetName: string | undefined;
}

const initialState: initialStateType = {
  loading: false,
  stepperStats: 0,
  filter: {
    assetId: undefined,
    flow: undefined,
  },
  isSaved: false,
  selectedAssetId: undefined,
  selectedParentAssetId: undefined,
  paramsValue: undefined,
  selectedAssetName: undefined,
  showSaveButton: false,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set selectedAssetName":
      draft.selectedAssetName = action.payload;
      break;
    case "set paramsValue":
      draft.paramsValue = action.payload;
      break;
    case "set selectedParentAssetId":
      draft.selectedParentAssetId = action.payload;
      break;
    case "set selectedAssetId":
      draft.selectedAssetId = action.payload;
      break;
    case "set stepperStats":
      draft.stepperStats = action.payload;
      break;
    case "set filter.assetId":
      draft.filter.assetId = action.payload;
      break;
    case "set filter.flow":
      draft.filter.flow = action.payload;
      break;
    case "set isSaved":
      draft.isSaved = action.payload;
      break;

    case "set showSaveButton":
      draft.showSaveButton = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
