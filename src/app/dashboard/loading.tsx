import React from "react";
import { Spin } from "antd";

export default function loading() {
  return (
    <div className="h-screen w-full">
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    </div>
  );
}
