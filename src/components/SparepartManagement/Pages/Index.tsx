"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import { Button, Flex, Form, Input } from "antd";
import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
// import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import ModalSparepart from "../Modal/ModalSparepart";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import TableListSparepart from "../Tables/TableListSparepart";

export default function SparepartList({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);
  const [form] = Form.useForm();

  const resTable = useSWRFetcher<any>({
    key: [`api/asset`],
    axiosOptions: {
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search,
        asset_type: state.filter.asset_type,
        order: 'created_at:DESC'
      },
    },
  });

  useEffect(() => {
    resTable.mutate();
  }, [state.filter, state.pagination]);

  return (
    <>
      <SparepartListContext.Provider
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
                    dispatch({ type: "set filter.search", payload: undefined })
                  }}
                >
                  Atur Ulang
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  loading={resTable.isLoading}
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
              <Button
                onClick={() => {
                  dispatch({ type: "set formType", payload: "add" });
                  handlersModal.open();
                }}
                icon={<PlusOutlined />}
                type="primary"
              >
                Tambah Data
              </Button>
            </div>
          </div>

          <ModalSparepart open={openedModal} handlersModal={handlersModal} />

          <TableListSparepart handlersModal={handlersModal} />
        </div>
      </SparepartListContext.Provider>
    </>
  );
}

export const SparepartListContext = createContext<any | undefined>(undefined);

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
  };
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
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
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
    case "set filter.asset_type":
      draft.filter.asset_type = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
