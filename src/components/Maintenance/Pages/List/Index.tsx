"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Input, notification } from "antd";
import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";

export default function MaintenanceList({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);
  const [form] = Form.useForm();

  const resMaintenance = useSWRFetcher<any>({
    key: [`api/maintenance`],
    axiosOptions: {
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search,
        is_maintenance: true,
        order: 'updated_at:DESC'
      },
    },
  });

  const updateMaintenance = useSWRMutationFetcher({
    key: [`update:api/maintenance`],
    axiosOptions: {
      method: "PATCH",
      url: `api/maintenance`,
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

  useEffect(() => {
    resMaintenance.mutate();
  }, [state.filter]);

  return (
    <>
      <MaintenanceListContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resMaintenance,
          updateMaintenance
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
                <Input type="text" placeholder="Masukan ID Gerbong, Phase" />
              </Form.Item>
              <Form.Item>
                <Button 
                  icon={<UndoOutlined />}
                  onClick={() => {
                    form.setFieldValue("search", undefined);
                    dispatch({ type: "set filter.search", payload: undefined })
                  }}
                >Atur Ulang</Button>
              </Form.Item>
              <Form.Item>
                <Button 
                  loading={resMaintenance.isLoading}
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
          <div className="flex align-items-center justify-between">
            <p>Search Table</p>
            <div className="flex align-items-center gap-2">
              {/* <Button>Cek Data</Button> */}
              <Link href={"/dashboard/maintenance/add"}>
                <Button icon={<PlusOutlined />} type="primary">
                  Tambah Data
                </Button>
              </Link>
            </div>
          </div>

          <TableListMaintenance handlersModal={handlersModal} />
        </div>
      </MaintenanceListContext.Provider>
    </>
  );
}

export const MaintenanceListContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  filter: {
    search: string | undefined;
    flow: string | undefined;
  };
  pagination: {
    limit: number;
    page: number;
  };
  selectedAssetId: string | undefined;
}

const initialState: initialStateType = {
  loading: false,
  filter: {
    search: undefined,
    flow: undefined,
  },
  pagination: {
    limit: 10,
    page: 1,
  },
  selectedAssetId: undefined
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set selectedAssetId":
      draft.selectedAssetId = action.payload;
      break;
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set filter.flow":
      draft.filter.flow = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
    case "set pagination":
      draft.pagination = action.payload;
      break;
  }
}
