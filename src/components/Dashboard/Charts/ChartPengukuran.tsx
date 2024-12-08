"use client";
import React, { useContext, useMemo } from "react";
import moment from "moment";
import dynamic from "next/dynamic";
import { DashboardContext } from "../Pages/Index";
import { isArray } from "lodash";
import { Card, Radio } from "antd";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ChartPengukuran({ series }: any) {
  const {
    state: [state, dispatch],
    resSeriesMaintenanceSummary,
  }: any = useContext(DashboardContext);

  const mapOptions: any = {
    diameter: "avg_diameter",
    flens: "avg_flens",
  };

  // ApexChart options
  const options: any = {
    title: {
      align: "left",
      style: {
        fontSize: "12px",
        fontWeight: "thin",
      },
    },
    chart: {
      id: "apexchart-example",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      width: 3,
    },
    yaxis: {
      max: state.options === "diameter" ? 1000 : 200,
      min: 0,
    },
    xaxis: {
      labels: {
        show: true,
        datetimeUTC: false, // Display dates in local time
        formatter: (value: number) => moment(value).format("MMM YYYY"),
      },
    },
  };

  // Transform data for chart
  const chartSeries = useMemo(() => {
    const data = resSeriesMaintenanceSummary?.data;
    if (!isArray(data)) return [];

    const seriesData: Record<string, { x: string; y: number }[]> = {};

    data.forEach((entry: any) => {
      const date = new Date(entry.month_year).toISOString();
      entry.avg &&
        Object.entries(entry.avg).forEach(([bogieType, stats]: any[]) => {
          if (!seriesData[bogieType]) {
            seriesData[bogieType] = [];
          }
          seriesData[bogieType].push({
            x: date,
            y: stats[mapOptions[state.options]], // Change to `avg_flens` for flens
          });
        });
    });

    return Object.entries(seriesData).map(([bogieType, dataPoints]) => ({
      name: `Bogie ${bogieType}`,
      data: dataPoints,
    }));
  }, [resSeriesMaintenanceSummary?.data, state.options]);

  return (
    <div className="my-8">
      <Card>
        <div className="flex justify-between gap-4">
          <p>Rata Rata Pengukuran</p>
          <Radio.Group
            onChange={(e) => {
              dispatch({
                type: "set options",
                payload: e.target.value,
              });
            }}
            value={state.options}
          >
            <Radio value={"diameter"}>Diameter</Radio>
            <Radio value={"flens"}>Flens</Radio>
          </Radio.Group>
        </div>
        <ReactApexChart
          type="line"
          options={options}
          series={chartSeries}
          width="100%"
          height={400}
        />
      </Card>
    </div>
  );
}
