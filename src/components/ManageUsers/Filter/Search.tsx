"use client";
import React, {
  ServerContext,
  ServerContextJSONValue,
  useContext,
  useEffect,
} from "react";
import { Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function Search({
  placeholder,
  context,
  handlersModal,
}: {
  placeholder: string;
  context: ServerContext<ServerContextJSONValue>;
  handlersModal: any;
}) {
  const {
    session,
    state: [state, dispatch],
    page,
    resTable
  }: any = useContext(context);
  const [form] = Form.useForm();


  const canViewListUser = useHasPermission({
    requiredPermission: ["userManagement.viewListOfUser"],
    session,
  });

  const canViewListRole = useHasPermission({
    requiredPermission: ["userManagement.viewAllRoles"],
    session,
  });

  const canAddNewUser = useHasPermission({
    requiredPermission: ["userManagement.addNewUser"],
    session,
  });

  const canAddNewRole = useHasPermission({
    requiredPermission: ["userManagement.addNewRole"],
    session,
  });

  const pagePermissionsAddData: any = {
    user: canAddNewUser,
    role: canAddNewRole,
  };

  const pagePermissionsViewList: any = {
    user: canViewListUser,
    role: canViewListRole,
  };

  useEffect(() => {
    resTable.mutate()
  }, [state.filter.search])

  return (
    <div className="flex justify-between">
      {pagePermissionsViewList[page] && (
        <div className="w-1/2 lg:w-1/3">
          <Form form={form} onFinish={(value) => {
            dispatch({ type: "set filter.search", payload: value.search });
            // resTable.mutate();
          }}>
          <div className="flex gap-2">
            <Form.Item
              name="search"
              style={{ width: "100%" }}
            >
            <Input
              style={{ borderRadius: "4px", width: "100%", float: "right" }}
              placeholder={placeholder}
              allowClear
              onClear={() => dispatch({ type: "set filter.search", payload: undefined })}
            />
            </Form.Item>
            <Button loading={resTable.isLoading} htmlType="submit" type="primary">Search</Button>
          </div>
          </Form>
        </div>
      )}
      {pagePermissionsAddData[page] && (
        <div>
          <Button
            type="primary"
            onClick={() => {
              dispatch({ type: "set formType", payload: "add" });
              handlersModal.open();
            }}
            icon={<PlusOutlined />}
          >
            Add New
          </Button>
        </div>
      )}
    </div>
  );
}
