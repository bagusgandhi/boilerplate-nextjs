"use client";
import { Button, Popconfirm, Spin, Table, notification } from "antd";
import React, { useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function TableList({
  handlersModal,
  dataFetcher,
  columnsConfig,
  permissions,
  onDelete,
  paginationState,
  onChange,
  pagination
}: any) {
  const { data, isLoading, mutate } = dataFetcher;

  const columns = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (text: any, record: any, index: number)  =>
        paginationState.limit * (paginationState.page - 1) + index + 1,
    },
    ...columnsConfig,
    {
      title: "Action",
      key: "action",
      width: 400,
      render: (record: any) => (
        <div className="flex gap-2">
          {permissions.canUpdate && (
            <Button
              onClick={() => {
                handlersModal.open("edit", record.id);
              }}
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
          {permissions.canDelete && (
            <Popconfirm
              placement="bottom"
              title={"Warning"}
              description={`Are you sure to delete "${record.name}"?`}
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await onDelete(record.id);
                await mutate();
              }}
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    mutate();
  }, [paginationState]);

  return (
    <Spin size="large" spinning={isLoading}>
      <Table
        dataSource={data?.results?.map((item: any) => ({ ...item, key: item.id }))}
        columns={columns}
        onChange={onChange}
        pagination={pagination}
      />
    </Spin>
  );
}
