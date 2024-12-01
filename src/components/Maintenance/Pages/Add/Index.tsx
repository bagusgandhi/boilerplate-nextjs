"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Input, Spin, Steps } from "antd";
import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";

export default function MaintenanceAdd({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);
  const [form] = Form.useForm();

  const resFlow = useSWRFetcher<any>({
    key: [`api/flow`],
    axiosOptions: {
      params: {
        order: "position:ASC",
      },
    },
  });

  const resAsset = useSWRFetcher<any>({
    key: state.filter.search && [`api/asset`],
    axiosOptions: {
      params: {
        viewAll: true,
        search: state.filter.search,
        asset_type: 'Gerbong',
      },
    },
  });

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
        }}
      >
        <Spin size="large" spinning={resFlow?.isLoading}>
          <div className="flex flex-col gap-8 bg-white p-8 mt-6">
            <Steps
              type="default"
              current={state.stepperStats}
              items={stepperItem ?? []}
            />
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
                  <Input type="text" placeholder="Masukan ID Gerbong" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={resAsset?.isLoading}
                    htmlType="submit"
                    icon={<SearchOutlined />}>
                      Cek ID
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<PlusOutlined />} type="primary">
                    Daftar Data Baru
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
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
    search: string | undefined;
    flow: string | undefined;
  };
}

const initialState: initialStateType = {
  loading: false,
  stepperStats: 0,
  filter: {
    search: undefined,
    flow: undefined,
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set filter.flow":
      draft.filter.flow = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
