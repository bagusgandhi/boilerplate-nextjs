"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Input } from "antd";
import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
// import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
// import ModalSparepart from "../Modal/ModalSparepart";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import TableListMaintenanceLog from "../Table/TableListMaintenanceLog";
// import TableListSparepart from "../Tables/TableListSparepart";

export default function MaintenanceLog({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [form] = Form.useForm();
  // const [openedModal, handlersModal] = useDisclosure(false);

  const resTable = useSWRFetcher<any>({
    key: {
      url: 'api/maintenance-log',
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search
      },
    },
    // key: [`log:api/maintenance-log`],
    // axiosOptions: {
    //   url: 'api/maintenance-log',
    //   params: {
    //     page: state.pagination.page,
    //     limit: state.pagination.limit,
    //     search: state.filter.search
    //   },
    // },
  });


  // useEffect(() => {
  //   resTable.mutate();
  // }, [state.filter, state.pagination]);

  return (
    <>
      <MaintenanceLogContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resTable,
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
                <Input type="text" placeholder="Masukan Sparepart, ID" />
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
                  // loading={resTable.isLoading}
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
          <TableListMaintenanceLog />
        </div>
      </MaintenanceLogContext.Provider>
    </>
  );
}

export const MaintenanceLogContext = createContext<any | undefined>(undefined);

interface initialStateType {
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    search: string | undefined;
  };
}

const initialState: initialStateType = {
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    search: undefined,
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set pagination":
      draft.pagination = action.payload;
      break;
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
  }
}
