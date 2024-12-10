import React, { useContext, useEffect } from "react";
import { MaintenanceAddContext } from "../Pages/Index";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
  PrinterOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useDisclosure } from "@mantine/hooks";
import ModalSwap from "../Modal/ModalSwap";
import ModalPengukuran from "../Modal/ModalPengukuran";
import ModalEngineering from "../Modal/ModalEngineering";
import ModalLokasiSimpan from "../Modal/ModalLokasiSimpan";
import { flowMap, flowMapReverse } from "@/utils/const/flowMap";
const { Text } = Typography;

export default function StepperContentAdd() {
  const {
    session,
    state: [state, dispatch],
    resAssetDetail,
    updateAsset,
  }: any = useContext(MaintenanceAddContext);
  const router = useRouter();
  const [openedModalSwap, handlersModalSwap] = useDisclosure(false);
  const [openedModalPengukuran, handlersModalPengukuran] = useDisclosure(false);
  const [openedModalEngineering, handlersModalEngineering] =
    useDisclosure(false);
  const [openedModalLokasi, handlersModalLokasi] = useDisclosure(false);

  const [formWo] = Form.useForm();

  const columnsInisialisasi: any = [
    {
      title: "ID Wheel",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "ID Bogie",
      dataIndex: ["parent_asset", "name"],
      key: ["parent_asset", "name"],
      render: (text: any) => {
        return text ? `${text}` : "-";
      },
    },
    {
      title: "Tanggal",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: any) => {
        return text ? moment(text).format("DD/MM/YYYY") : "-";
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
      title: "Flens",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any) => {
        return text ? text.flens : "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return text ?? "-";
      },
    },
  ];

  const columnsPengukuran: any = [
    {
      title: "ID Wheel",
      dataIndex: "name",
      key: "name",
      render: (text: any, record: any, index: any) => {
        return text ? (
          <div className="flex gap-2 items-center">
            {text}
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                dispatch({
                  type: "set selectedAssetId",
                  payload: record?.id,
                });

                dispatch({
                  type: "set selectedParentAssetId",
                  payload: record?.parent_asset?.id,
                });

                handlersModalSwap.open();
              }}
            />
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      title: "ID Bogie",
      dataIndex: ["parent_asset", "name"],
      key: ["parent_asset", "name"],
      render: (text: any) => {
        return text ? `${text}` : "-";
      },
    },
    {
      title: "Diameter",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any, record: any, index: any) => {
        const updatedAt = moment(record.updated_at).startOf('day');
        const today = moment().startOf('day');
        return <>{updatedAt < today ? "-" : text?.diameter }</>;
      },
    },
    {
      title: "Flens",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any, record: any, index: any) => {
        const updatedAt = moment(record.updated_at).startOf('day');
        const today = moment().startOf('day');
        return <>{updatedAt < today ? "-" : text?.flens }</>;
      },
    },
    {
      title: "Ukur",
      dataIndex: "",
      key: "ukur",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: "set selectedAssetId",
                  payload: record?.id,
                });

                dispatch({
                  type: "set paramsValue",
                  payload: record?.paramsValue,
                });

                dispatch({
                  type: "set selectedAssetName",
                  payload: record?.name,
                });

                handlersModalPengukuran.open();
              }}
            >
              Ukur Keping Roda
            </Button>
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    // {
    //   title: "Status Ukur",
    //   dataIndex: "",
    //   key: "status_ukur",
    //   render: (text: any) => {
    //     return <></>;
    //   },
    // },
  ];

  const columnsEngineering: any = [
    {
      title: "ID Wheel",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "ID Bogie",
      dataIndex: ["parent_asset", "name"],
      key: ["parent_asset", "name"],
      render: (text: any) => {
        return text ? `${text}` : "-";
      },
    },
    {
      title: "Diameter",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any, record: any, index: any) => {
        const updatedAt = moment(record.updated_at).startOf('day');
        const today = moment().startOf('day');
        return <>{updatedAt < today ? "-" : text?.diameter }</>;
      },
    },
    {
      title: "Flens",
      dataIndex: "paramsValue",
      key: "paramsValue",
      render: (text: any, record: any, index: any) => {
        const updatedAt = moment(record.updated_at).startOf('day');
        const today = moment().startOf('day');
        return <>{updatedAt < today ? "-" : text?.flens }</>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "Aksi",
      dataIndex: "",
      key: "aksi",
      render: (text: any, record: any, index: any) => {
        return (
          <div className="flex">
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: "set selectedAssetId",
                  payload: record?.id,
                });

                dispatch({
                  type: "set paramsValue",
                  payload: record?.paramsValue,
                });

                dispatch({
                  type: "set selectedAssetName",
                  payload: record?.name,
                });

                handlersModalEngineering.open();
              }}
            >
              Engineering
            </Button>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: "set selectedAssetId",
                  payload: record?.id,
                });

                dispatch({
                  type: "set selectedParentAssetId",
                  payload: record?.parent_asset?.id,
                });

                handlersModalSwap.open();
              }}
            >
              Ganti Roda
            </Button>
          </div>
        );
      },
    },
  ];

  const columnPenyimpanan: any = [
    {
      title: "ID Wheel",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "Aksi",
      dataIndex: "",
      key: "aksi",
      render: (text: any, record: any, index: any) => {
        return (
          <div className="flex">
            <Button
              type="link"
              onClick={() => {
                // console.log("simpan")
                dispatch({
                  type: "set selectedAssetId",
                  payload: record?.id,
                });

                dispatch({
                  type: "set selectedAssetName",
                  payload: record?.name,
                });

                handlersModalLokasi.open();
              }}
            >
              Simpan
            </Button>
            <Popconfirm
              title={`Apakah yakin akan membuang Keping Roda ${record?.name}?`}
              okText="Yes"
              cancelText="No"
              placement="bottom"
              onConfirm={async () => {
                const data = {
                  data: {
                    name: record.name,
                    asset_type: "Keping Roda",
                    flow: flowMapReverse[state.stepperStats],
                    parent_asset_id: null,
                    status: "not_feasible",
                  },
                };

                await updateAsset.trigger(data);
                await resAssetDetail.mutate();
              }}
            >
              <Button
                type="link"
                onClick={() => {
                  dispatch({
                    type: "set selectedAssetId",
                    payload: record?.id,
                  });
                }}
              >
                Buang
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return text ?? "-";
      },
    },
  ];

  useEffect(() => {
    if (resAssetDetail?.data) {
      dispatch({
        type: "set stepperStats",
        payload: flowMap[resAssetDetail?.data?.maintenance?.flow?.name] ?? 0,
      });

      const filteredData = resAssetDetail.data?.children
      ?.flatMap((item: any) => item.children)
      .filter((child: any) => child.status === "active")
      .map(({ children, ...rest }: any) => rest) ?? []

      const today = moment().startOf("day");
      const allDatesMatch = filteredData.length > 0 && filteredData.every((item: any) =>
        moment(item.updated_at).isSame(today, "day")
      );

      allDatesMatch && dispatch({
        type: "set showSaveButton",
        payload: true,
      })

    }
  }, [resAssetDetail?.data]);

  const handleFinish = async () => {
    const data: any = {
      data: {
        asset_id: resAssetDetail?.data?.id,
        flow: null,
        is_maintenance: false,
        wo_number: null,
        program: null,
      },
    };

    await updateMaintenance.trigger(data);
  };

  const handleSave = async () => {
    const data: any = {
      data: {
        asset_id: resAssetDetail?.data?.id,
        flow: flowMapReverse[state.stepperStats],
      },
    };

    await updateMaintenance.trigger(data);

    // setIsSaved(true); // Enable the "Next" button
    dispatch({
      type: "set isSaved",
      payload: true,
    });
  };

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
          description: "maintenance has been updated",
        });
      },
    },
  });


  const handleOk = async () => {
    try {
      await formWo.validateFields();
      const values = formWo.getFieldsValue();

      const data: any = {
        data: {
          wo_number: values.wo_number,
          program: values.program,
          asset_id: resAssetDetail?.data?.id,
          flow: "inisialisasi",
        },
      };

      // console.log()
      // resAssetDetail?.data?.maintenance.wo_number
      // resAssetDetail?.data?.maintenance.program

      await updateMaintenance.trigger(data);
      await resAssetDetail.mutate();

      dispatch({
        type: "set stepperStats",
        payload: state.stepperStats + 1,
      });

    } catch (error) {
      message.error("Form submission failed. Please check your inputs.");
    }
  };

  formWo.setFieldsValue({
    wo_number: resAssetDetail?.data?.maintenance.wo_number,
    program: resAssetDetail?.data?.maintenance.program
  })

  return (
    <>
      {/* inisialisasi */}
      {state.stepperStats === 0 && resAssetDetail?.data && (
        <Row gutter={[16, 16]}>
          {/* information step inisialisasi */}
          <Col xs={10}>
            <Card
              title="Nomor WO & Program Pengukuran"
              style={{ marginBottom: "16px" }}
            >
              <Form form={formWo} onFinish={handleOk}>
                <Form.Item 
                  name="wo_number"
                  rules={[{ required: true, message: "Please input your wo number!" }]}
                >
                  <Input 
                    type="text" 
                    placeholder="Nomor WO"
                    disabled={(resAssetDetail?.data?.maintenance.wo_number && resAssetDetail?.data?.maintenance.program)} 
                  />
                </Form.Item>
                <Form.Item 
                  name="program"
                  rules={[{ required: true, message: "Please input your program!" }]}
                  >
                  <Select
                    disabled={(resAssetDetail?.data?.maintenance.wo_number && resAssetDetail?.data?.maintenance.program)} 
                    placeholder="Program Pengukuran"
                    options={[
                      {
                        label: "P1",
                        value: "P1",
                      },
                      {
                        label: "P3",
                        value: "P3",
                      },
                      {
                        label: "P6",
                        value: "P6",
                      },
                      {
                        label: "P12",
                        value: "P12",
                      }
                    ]}
                  />
                </Form.Item>
                  {!resAssetDetail?.data?.maintenance.wo_number && (<Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Simpan
                  </Button>)}
              </Form>
            </Card>
            <Card title="Nomor Train Set" style={{ marginBottom: "16px" }}>
              <Title level={3}>
                {resAssetDetail?.data?.parent_asset?.name}
              </Title>
            </Card>

            <Card
              title="Nomor Gerbong"
              style={{ marginBottom: "16px" }}
              extra={<a href="#">More</a>}
            >
              <Text copyable style={{ fontSize: "24px", fontWeight: "bold" }}>
                {resAssetDetail?.data?.name}
              </Text>
            </Card>

            {/* <Card
              title="Riwayat"
              style={{ marginBottom: "16px" }}
              extra={<a href="#">More</a>}
            >
              <p className="text-sm">Aktivitas Terakhir</p>
            </Card> */}
          </Col>

          {/* list Keping Roda */}
          <Col xs={14}>
            <Card
              title="Wheel List"
              style={{ marginBottom: "16px" }}
              extra={<a href="/dashboard/sparepart-management">More</a>}
            >
              <Table
                columns={columnsInisialisasi}
                dataSource={
                  // resAssetDetail.data?.children
                  //   ?.flatMap((item: any) => item.children)
                  //   .filter((child: any) => child.status === "active")
                  //   .map(({ children, ...rest }: any) => rest) ?? []
                  resAssetDetail.data?.children
                    ?.flatMap((item: any) => item.children)
                    .map(({ children, ...rest }: any) => rest) ?? []
                    // .filter((child: any) => child.status === "active")
                }
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* pengukuran */}
      {state.stepperStats === 1 && (
        <div>
          <Spin spinning={resAssetDetail.isLoading}>
            <Table
              columns={columnsPengukuran}
              dataSource={
                resAssetDetail.data?.children
                  ?.flatMap((item: any) => item.children)
                  // .filter((child: any) => child.status === "active")
                  .map(({ children, ...rest }: any) => rest) ?? []
              }
              pagination={false}
            />
          </Spin>
        </div>
      )}

      {/* engineering */}
      {state.stepperStats === 2 && (
        <div>
          <Spin spinning={resAssetDetail.isLoading}>
            <Table
              columns={columnsEngineering}
              dataSource={
                resAssetDetail.data?.children
                  ?.flatMap((item: any) => item.children)
                  // .filter((child: any) => child.status === "active")
                  .map(({ children, ...rest }: any) => rest) ?? []
              }
              pagination={false}
            />
          </Spin>
        </div>
      )}

      {/* penyimpanan */}
      {state.stepperStats === 3 && (
        <div>
          <Spin spinning={resAssetDetail.isLoading}>
            <Table
              columns={columnPenyimpanan}
              dataSource={
                resAssetDetail.data?.children
                  ?.flatMap((item: any) => item.children)
                  .filter((child: any) => child.status === "inactive")
                  .map(({ children, ...rest }: any) => rest) ?? []
              }
              pagination={false}
            />
          </Spin>
        </div>
      )}

      {/* assembly */}
      {state.stepperStats === 4 && (
        <Row gutter={[16, 16]}>
          {/* information step inisialisasi */}
          <Col xs={10}>
            <Card title="Nomor Train Set" style={{ marginBottom: "16px" }}>
              <Title level={3}>
                {resAssetDetail?.data?.parent_asset?.name}
              </Title>
            </Card>

            <Card
              title="Nomor Gerbong"
              style={{ marginBottom: "16px" }}
              extra={<a href="/dashboard/asset-management">More</a>}
            >
              <Text copyable style={{ fontSize: "24px", fontWeight: "bold" }}>
                {resAssetDetail?.data?.name}
              </Text>
            </Card>
          </Col>

          {/* list Keping Roda */}
          <Col xs={14}>
            <Card
              title="Wheel List"
              style={{ marginBottom: "16px" }}
              extra={<a href="/dashboard/sparepart-management">More</a>}
            >
              <Table
                columns={columnsInisialisasi}
                dataSource={
                  resAssetDetail.data?.children
                    ?.flatMap((item: any) => item.children)
                    // .filter((child: any) => child.status === "active")
                    .map(({ children, ...rest }: any) => rest) ?? []
                }
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* button control stepper */}
      {resAssetDetail.data && (
        <Col xs={24}>
          <Flex gap={10} justify={"flex-end"} align={"center"}>
            {/* print */}
            {/* {state.stepperStats === 0 && (
              <Button icon={<PrinterOutlined />}>Print</Button>
            )} */}

            {/* prev */}
            {state.stepperStats > 0 && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  dispatch({
                    type: "set stepperStats",
                    payload: state.stepperStats - 1,
                  });
                  dispatch({
                    type: "set isSaved",
                    payload: false,
                  });
                }}
              >
                Previous
              </Button>
            )}

            {/* save */}
            {state.stepperStats !== 0 && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!state.showSaveButton}
              >
                Save
              </Button>
            )}

            {/* next */}
            {(state.stepperStats < 4 && (resAssetDetail?.data?.maintenance.wo_number && resAssetDetail?.data?.maintenance.program)) &&  (
              <Button
                icon={<ArrowRightOutlined />}
                disabled={state.stepperStats === 0 ? false : !state.isSaved}
                onClick={async () => {
                  // if (state.stepperStats === 0) {
                  //   const data: any = {
                  //     data: {
                  //       asset_id: resAssetDetail?.data?.id,
                  //       flow: "inisialisasi",
                  //     },
                  //   };

                  //   await updateMaintenance.trigger(data);
                  // }

                  dispatch({
                    type: "set stepperStats",
                    payload: state.stepperStats + 1,
                  });

                  dispatch({
                    type: "set isSaved",
                    payload: false,
                  });
                }}
              >
                Next
              </Button>
            )}

            {/* finish */}
            {state.stepperStats === 4 && (
              <Button
                type="primary"
                disabled={!state.isSaved}
                onClick={handleFinish}
              >
                Finish
              </Button>
            )}
          </Flex>
        </Col>
      )}

      {/* modals */}
      <ModalSwap open={openedModalSwap} handlersModal={handlersModalSwap} />
      <ModalPengukuran
        open={openedModalPengukuran}
        handlersModal={handlersModalPengukuran}
      />
      <ModalEngineering
        open={openedModalEngineering}
        handlersModal={handlersModalEngineering}
      />
      <ModalLokasiSimpan
        open={openedModalLokasi}
        handlersModal={handlersModalLokasi}
      />
    </>
  );
}
