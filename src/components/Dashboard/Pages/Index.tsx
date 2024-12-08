"use client";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import moment from "moment";
// import dynamic from "next/dynamic";
import React, { createContext, use, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import ChartPengukuran from "../Charts/ChartPengukuran";
import { render } from "react-dom";
import ChartTotalPengukuran from "../Charts/ChartTotalPengukuran";
// import ChartPengukuran from "../Charts/ChartPengukuran";
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

export default function Index({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const searchParams = useSearchParams();

  const kepingRodaId = searchParams.get("id");
  console.log(kepingRodaId);

  const resTrainSet = useSWRFetcher<any>({
    key: [`options-trainset:api/asset`],
    axiosOptions: {
      url: "api/asset",
      params: {
        viewAll: true,
        asset_types: ["Train Set"],
        order: "created_at:DESC",
      },
    },
  });

  const resGerbong = useSWRFetcher<any>({
    key: [`options-gerbong:api/asset`],
    axiosOptions: {
      url: "api/asset",
      params: {
        viewAll: true,
        asset_types: ["Gerbong"],
        order: "created_at:DESC",
      },
    },
  });

  const resKepingRoda = useSWRFetcher<any>({
    key: [`options-keping-roda:api/asset`],
    axiosOptions: {
      url: "api/asset",
      params: {
        viewAll: true,
        asset_types: ["Keping Roda"],
        order: "created_at:DESC",
      },
    },
  });

  const resTableMaintenanceSummary = useSWRFetcher<any>({
    key: [`table:api/maintenance-summary`],
    axiosOptions: {
      url: "api/maintenance-summary",
      params: {
        startedAt: state.filter?.dateRange?.[0],
        endedAt: state.filter?.dateRange?.[1],
        train_set: state.filter.trainSet,
        gerbong: state.filter.gerbong,
      },
    },
  });

  const resSeriesMaintenanceSummary = useSWRFetcher<any>({
    key: [`series:api/maintenance-summary`],
    axiosOptions: {
      url: "api/maintenance-summary/series",
      params: {
        startedAt: state.filter?.dateRange?.[0],
        endedAt: state.filter?.dateRange?.[1],
        train_set: state.filter.trainSet,
        gerbong: state.filter.gerbong,
      },
    },
  });

  const columns: any = [
    {
      title: "No",
      key: "no",
      width: 60,
      render: (text: any, record: any, index: number) =>
        state.pagination.limit * (state.pagination.page - 1) + index + 1,
      fixed: "left",
    },
    {
      title: "Date",
      dataIndex: "month_year",
      key: "month_year",
      render: (text: any) => {
        return moment(text).format("MMM YYYY") ?? "-";
      },
      fixed: "left",
      width: 100,
    },
    {
      title: "Train Set",
      dataIndex: "train_set",
      key: "train_set",
      render: (text: any) => {
        return text ?? "-";
      },
      fixed: "left",
      width: 120,
    },
    {
      title: "Gerbong",
      dataIndex: "gerbong",
      key: "gerbong",
      render: (text: any) => {
        return text ?? "-";
      },
      fixed: "left",
      width: 150,
    },
    {
      title: "BG 1Ø1",
      dataIndex: ["details", 0, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1Ø2",
      dataIndex: ["details", 1, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1Ø3",
      dataIndex: ["details", 2, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1Ø4",
      dataIndex: ["details", 3, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2Ø1",
      dataIndex: ["details", 4, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2Ø2",
      dataIndex: ["details", 5, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2Ø3",
      dataIndex: ["details", 6, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2Ø4",
      dataIndex: ["details", 7, "avg_diameter"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1F1",
      dataIndex: ["details", 0, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1F2",
      dataIndex: ["details", 1, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1F3",
      dataIndex: ["details", 2, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 1F4",
      dataIndex: ["details", 3, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2F1",
      dataIndex: ["details", 4, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2F2",
      dataIndex: ["details", 5, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2F3",
      dataIndex: ["details", 6, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
    {
      title: "BG 2F4",
      dataIndex: ["details", 7, "avg_flens"],
      key: "name",
      render: (text: any) => {
        return text ?? "-";
      },
    },
  ];

  useEffect(() => {
    resSeriesMaintenanceSummary.mutate();
    resTableMaintenanceSummary.mutate();
  }, [state.filter]);

  const disabledDate = (current: any) => {
    return current && current > moment().endOf("day");
  };

  const CounterComponent = ({
    title,
    value,
  }: {
    title: string;
    value: number;
  }) => (
    <>
      <div className="text-center flex flex-col gap-4">
        {title}
        <p className="font-bold text-xl">{value}</p>
      </div>
    </>
  );

  return (
    <>
      <DashboardContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resSeriesMaintenanceSummary,
        }}
      >
        <div className="flex flex-col gap-4 bg-white p-6 mt-6">
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Spin
                spinning={
                  resSeriesMaintenanceSummary.isLoading ||
                  resSeriesMaintenanceSummary.isValidating
                }
              >
                <Row align={"middle"}>
                  <Col span={12}>
                    <Flex align="center" gap={10}>
                      <CounterComponent
                        title={"Jumlah Train Set"}
                        value={resTrainSet.data?.total}
                      />
                      <Divider type="vertical" variant={"solid"} />
                      <CounterComponent
                        title={"Jumlah Gerbong"}
                        value={resGerbong.data?.total}
                      />
                      <Divider type="vertical" variant={"solid"} />
                      <CounterComponent
                        title={"Jumlah Keping Roda"}
                        value={resKepingRoda.data?.total}
                      />
                      <Divider type="vertical" variant={"solid"} />
                      <CounterComponent
                        title={"Jumlah Train Set"}
                        value={resTrainSet.data?.total}
                      />
                      <Divider type="vertical" variant={"solid"} />
                      <CounterComponent title={"Jumlah Pengukuran"} value={0} />
                    </Flex>
                  </Col>
                  <Col span={12}>
                    <Flex align="center" gap={10}>
                      <Select
                        disabled={state.kepingRoda ? true : false}
                        style={{ width: "200px" }}
                        size="large"
                        placeholder="Train Set"
                        mode="multiple"
                        maxTagCount={0}
                        allowClear
                        options={
                          resTrainSet?.data?.results?.map((item: any) => ({
                            label: item.name,
                            value: item.name,
                          })) ?? []
                        }
                        onChange={(value) => {
                          dispatch({
                            type: "set filter.trainSet",
                            payload: value,
                          });
                        }}
                      />

                      <Select
                        disabled={state.kepingRoda ? true : false}
                        style={{ width: "200px" }}
                        size="large"
                        placeholder="Gerbong"
                        mode="multiple"
                        allowClear
                        maxTagCount={0}
                        options={
                          resGerbong?.data?.results?.map((item: any) => ({
                            label: item.name,
                            value: item.name,
                          })) ?? []
                        }
                        onChange={(value) => {
                          dispatch({
                            type: "set filter.gerbong",
                            payload: value,
                          });
                        }}
                      />

                      <Select
                        size="large"
                        allowClear
                        placeholder="Keping Roda"
                        options={
                          resKepingRoda?.data?.results?.map((item: any) => ({
                            label: item.name,
                            value: item.name,
                          })) ?? []
                        }
                        onChange={(value) => {
                          dispatch({
                            type: "set kepingRoda",
                            payload: value,
                          });
                        }}
                      />

                      <DatePicker.RangePicker
                        size="large"
                        picker="month"
                        disabledDate={disabledDate}
                        onChange={(date, dateString) => {
                          console.log(date, dateString);

                          if (date?.length) {
                            dispatch({
                              type: "set filter.dateRange",
                              payload: [
                                date[0]?.startOf("month").toISOString(),
                                date[1]?.endOf("month").toISOString(),
                              ],
                            });
                          } else {
                            dispatch({
                              type: "set filter.dateRange",
                              payload: undefined,
                            });
                          }
                        }}
                      />
                    </Flex>
                  </Col>
                </Row>

                <ChartTotalPengukuran />

                <ChartPengukuran />

                <Table
                  scroll={{ x: 1920 }}
                  columns={columns}
                  dataSource={resTableMaintenanceSummary?.data?.results}
                  pagination={{
                    current: state.pagination.page,
                    pageSize: state.pagination.limit,
                    total: resTableMaintenanceSummary?.data?.total,
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
            </Col>
          </Row>
        </div>
      </DashboardContext.Provider>
    </>
  );
}

export const DashboardContext = createContext<any | undefined>(undefined);

interface initialStateType {
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    trainSet: string | undefined;
    gerbong: string | undefined;
    dateRange: any[] | undefined;
  };
  kepingRoda: string | undefined;
  options: string;
}

const initialState: initialStateType = {
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    trainSet: undefined,
    gerbong: undefined,
    dateRange: undefined,
  },
  kepingRoda: undefined,
  options: "diameter",
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set options":
      draft.options = action.payload;
      break;
    case "set pagination":
      draft.pagination = action.payload;
      break;
    case "set filter.dateRange":
      draft.filter.dateRange = action.payload;
      break;
    case "set filter.trainSet":
      draft.filter.trainSet = action.payload;
      break;
    case "set filter.gerbong":
      draft.filter.gerbong = action.payload;
      break;
    case "set kepingRoda":
      draft.kepingRoda = action.payload;
      break;
  }
}