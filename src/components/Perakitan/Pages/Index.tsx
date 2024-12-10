"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Input, notification } from "antd";
import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
// import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
// import ModalSparepart from "../Modal/ModalSparepart";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import TableListPerakitan from "../Table/TableListPerakitan";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import ModalSwapPerakitan from "../Modal/ModalSwapPerakitan";
// import TableListSparepart from "../Tables/TableListSparepart";

export default function PerakitanList({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);
  const [form] = Form.useForm();

  const resTableTrain = useSWRFetcher<any>({
    key: {
      url: "api/asset",
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search,
        with_children: true,
        asset_types: ["Train Set"],
        order: "created_at:DESC",
      },
    },
    // key: [`train:api/asset`],
    // axiosOptions: {
    //   url: "api/asset",
    //   params: {
    //     page: state.pagination.page,
    //     limit: state.pagination.limit,
    //     search: state.filter.search,
    //     with_children: true,
    //     asset_types: ["Train Set"],
    //     order: "created_at:DESC",
    //   },
    // },
  });

  const deleteSparepart = useSWRMutationFetcher({
    key: [`patch:api/asset`],
    axiosOptions: {
      method: "PATCH",
      url: `api/asset/${state.assetId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Data has been deleted",
        });
      },
    },
  });

  const updateAsset = useSWRMutationFetcher({
    key: [`updateParentAsset:api/asset`],
    axiosOptions: {
      method: "PATCH",
      url: `api/asset/${state.assetId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Asset data has been updated",
        });
      },
    },
  });

  const mapParent = {
    "Keping Roda": "Bogie",
    Bogie: "Gerbong",
    Gerbong: "Train Set",
  };

  // const resTableDetail = useSWRFetcher<any>({
  //   key: [`detail:api/asset`],
  //   axiosOptions: {
  //     url: 'api/asset',
  //     params: {
  //       page: state.pagination.page,
  //       limit: state.pagination.limit,
  //       search: state.filter.search,
  //       asset_type: 'Keping Roda',
  //       order: "created_at:DESC",
  //     },
  //   },
  // });

  // useEffect(() => {
  //   resTableTrain.mutate();
  // }, [state.filter, state.pagination]);

  return (
    <>
      <PerakitanListContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resTableTrain,
          deleteSparepart,
          mapParent,
          updateAsset
        }}
      >
        <div className="flex flex-col gap-4 bg-white p-6 mt-6">
          <Form
            layout="horizontal"
            form={form}
            onFinish={(value) => {
              dispatch({ type: "set filter.search", payload: value.search });
            }}
          >
            <Flex align="center" justify="space-between" gap={10}>
              <Form.Item
                label="Pencarian"
                name="search"
                style={{ flex: 1, width: "100%" }}
              >
                <Input type="text" placeholder="Masukan Train Set, Gerbong, Bogie atau Keping Roda ID" />
              </Form.Item>
              <Form.Item>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => {
                    form.setFieldValue("search", undefined);
                    dispatch({ type: "set filter.search", payload: undefined });
                  }}
                >
                  Atur Ulang
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  loading={resTableTrain.isLoading}
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  type="primary"
                >
                  Cari
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </div>

        <div className="flex flex-col gap-4 bg-white p-6 mt-6">
          <ModalSwapPerakitan
            open={openedModal}
            handlersModal={handlersModal}
          />

          <TableListPerakitan handlersModal={handlersModal} />
        </div>
      </PerakitanListContext.Provider>
    </>
  );
}

export const PerakitanListContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  formType: string | undefined;
  assetId: string | undefined;
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    search: string | undefined;
    asset_type: string | undefined;
    asset_name: string | undefined;
    parent_asset_type: string | undefined;
    asset_types: string[] | undefined;
  };
  assetName: string | undefined;
}

const initialState: initialStateType = {
  loading: false,
  formType: undefined,
  assetId: undefined,
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    search: undefined,
    asset_type: undefined,
    asset_name: undefined,
    parent_asset_type: undefined,
    asset_types: undefined,
  },
  assetName: undefined,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set assetName":
      draft.assetName = action.payload;
      break;
    case "set assetId":
      draft.assetId = action.payload;
      break;
    case "set formType":
      draft.formType = action.payload;
      break;
    case "set pagination":
      draft.pagination = action.payload;
      break;
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set filter.parent_asset_type":
      draft.filter.parent_asset_type = action.payload;
      break;
    case "set filter.asset_name":
      draft.filter.asset_name = action.payload;
      break;
    case "set filter.asset_type":
      draft.filter.asset_type = action.payload;
      break;
    case "set filter.asset_types":
      draft.filter.asset_types = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
