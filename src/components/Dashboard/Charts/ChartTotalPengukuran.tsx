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

export default function ChartTotalPengukuran({ series }: any) {
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
      tickAmount: 5,
      floating: false,
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

    const seriesData: { x: string; y: number }[] = [];

    data.forEach((entry: any) => {
      const date = new Date(entry.month_year).toISOString();
      const total = entry.total_count && parseInt(entry.total_count);
      seriesData.push({
        x: date,
        y: total, // Change to `avg_flens` for flens
      });
    });

    return [{
      name: "Total Pengukuran",
      data: seriesData,
    }]
  }, [resSeriesMaintenanceSummary?.data, state.options]);

  return (
    <div className="my-8">
      <Card>
        <div className="flex justify-between gap-4">
          <p>Rekap Total Pengukuran</p>
        </div>
        <ReactApexChart
          type="bar"
          options={options}
          series={chartSeries}
          width="100%"
          height={400}
        />
      </Card>
    </div>
  );
}
