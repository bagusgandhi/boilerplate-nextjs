"use client";
import { useImmerReducer } from "use-immer";
import React, { createContext, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Steps,
  Table,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import TableListMaintenance from "../../Table/TableListMaintenance";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useRouter } from "next/navigation";
import Title from "antd/es/typography/Title";
import moment from "moment";

const { Text } = Typography;

export default function MaintenanceAdd({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const flowMap = {
    'inisialisasi': 0,
    'pengukuran': 1,
    'engineering': 2,
    'penyimpanan': 3,
    'assembly': 4
  }

  // jika maintenance null atau inisialisasi
  // maka ketika klik lanjut upsert maintenance data
  // namun jika tidak inisialisasi maka jangan lakukan upsert 

  const resFlow = useSWRFetcher<any>({
    key: [`api/flow`],
    axiosOptions: {
      params: {
        order: "position:ASC",
      },
    },
  });

  const resAsset = useSWRFetcher<any>({
    key: [`api/asset`],
    axiosOptions: {
      params: {
        viewAll: true,
        asset_type: "Gerbong",
      },
    },
  });

  const resAssetDetail = useSWRFetcher<any>({
    key: state.filter.assetId && [`api/asset/${state.filter.assetId}`],
  });

  let dataSource = resAssetDetail.data?.children?.flatMap(
    (item: any) => item.children
  ).map(({ children, ...rest }: any) => ({key: rest.id, ...rest}))

  // const defaultSelectedRowKeys = dataSource?.filter((item: any) => item.status === "active")
  // .map((item: any) => item.key);
  // console.log(dataSource)

  // const rowSelection = {
  //   selectedRowKeys: defaultSelectedRowKeys,
    // getCheckboxProps: (record: any) => ({
    //   disabled: true, // Disable the checkbox for all rows (no interaction)
    // }),
  // };

  // console.log("flatMap", resAssetDetail.data?.children?.flatMap((item: any) => item.children));

  useEffect(() => {
    resAsset.mutate();
  }, [state.filter]);

  const stepperItem = resFlow?.data?.results?.map((item: any) => ({
    title: item.name,
    description: item.description,
  }));

  const columns: any = [
    {
      title: "ID Wheel",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "Bogie",
      dataIndex: ["parent_asset", "bogie"],
      key: ["parent_asset", "bogie"],
      render: (text: any) => {
        return text ? `Bogie ${text}` : "-";
      },
    },
    {
      title: "Tanggal",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: any) => {
        return text ? moment(text).format("DD-MM-YYYY") : "-";
      },
    },
    {
      title: "Diameter",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any) => {
        return text ? text.diameter : "-";
      },
    },
    {
      title: "Flank",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any) => {
        return text ? text.flank : "-";
      },
    },
  ];

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
            
            {/* step info */}
            <Steps
              type="default"
              current={state.stepperStats}
              items={stepperItem ?? []}
            />

            {/* form search */}
            <Form
              layout="horizontal"
              form={form}
              onFinish={(value) => {
                dispatch({ type: "set filter.assetId", payload: value.search });
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
                    onClick={() =>
                      router.push("/dashboard/sparepart-management")
                    }
                  >
                    Daftar Data Baru
                  </Button>
                </Form.Item>
              </Flex>
            </Form>

            {resAssetDetail?.data && (
              <Row gutter={[16, 16]}>
                {/* information step inisialisasi */}
                <Col xs={12}>
                  <Card
                    title="Nomor Train Set"
                    style={{ marginBottom: "16px" }}
                  >
                    <Title level={3}>
                      {resAssetDetail?.data?.parent_asset?.name}
                    </Title>
                  </Card>

                  <Card
                    title="Nomor Gerbong"
                    style={{ marginBottom: "16px" }}
                    extra={<a href="#">More</a>}
                  >
                    <Text
                      copyable
                      style={{ fontSize: "24px", fontWeight: "bold" }}
                    >
                      {resAssetDetail?.data?.name}
                    </Text>
                  </Card>

                  <Card
                    title="Riwayat"
                    style={{ marginBottom: "16px" }}
                    extra={<a href="#">More</a>}
                  >
                    <p className="text-sm">Aktivitas Terakhir</p>
                  </Card>
                </Col>

                {/* list Keping Roda */}
                <Col xs={12}>
                  <Table
                    columns={columns}
                    dataSource={
                      resAssetDetail.data?.children?.flatMap(
                        (item: any) => item.children
                      ).map(({ children, ...rest }: any) => rest) ?? []
                    }
                    pagination={false}
                  />
                </Col>

                {/* button control stepper */}
                <Col xs={24}>
                  <Flex gap={10} justify={"flex-end"} align={"center"}>
                    <Button icon={<PrinterOutlined />}>Cetak</Button>
                    <Button 
                      icon={<ArrowRightOutlined />}
                      onClick={() => {
                        dispatch({ type: "set stepperStats", payload: state.stepperStats + 1 });
                      }}
                      >Lanjut</Button>
                  </Flex>
                </Col>
              </Row>
            )}
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
}

const initialState: initialStateType = {
  loading: false,
  stepperStats: 0,
  filter: {
    assetId: undefined,
    flow: undefined,
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set stepperStats":
      draft.stepperStats = action.payload;
      break;
    case "set filter.assetId":
      draft.filter.assetId = action.payload;
      break;
    case "set filter.flow":
      draft.filter.flow = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
