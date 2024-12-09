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

export default function ChartTotalPengukuranKepingRoda({ series }: any) {
  const {
    state: [state, dispatch],
    resSeriesKepingRodaMaintenanceSummary,
  }: any = useContext(DashboardContext);

  // Transform data for chart
  const chartSeries = useMemo(() => {
    const data = resSeriesKepingRodaMaintenanceSummary?.data?.results;
    if (!isArray(data)) return [];

    return [
      {
        name: "avg_diameter",
        data: resSeriesKepingRodaMaintenanceSummary?.data?.results.map((item: { month_year: any; avg_diameter: any; }): any => ({
          x: item.month_year,
          y: item.avg_diameter,
        }))
      },
      {
        name: "avg_flens",
        data: resSeriesKepingRodaMaintenanceSummary?.data?.results.map((item: { month_year: any; avg_flens: any; }): any => ({
          x: item.month_year,
          y: item.avg_flens,
        }))
      }
    ];
    
  }, [resSeriesKepingRodaMaintenanceSummary?.data]);

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

  return (
    <div className="my-8">
      <Card>
        <div className="flex justify-between gap-4">
          <p>History Pengukuran <b>{state.kepingRoda ?? "-"}</b></p>
        </div>
        <ReactApexChart
          type="line"
          options={options}
          series={chartSeries ?? []}
          width="100%"
          height={400}
        />
      </Card>
    </div>
  );
}
