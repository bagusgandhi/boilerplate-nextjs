"use client";
import { Divider, Form, Input, Modal, Spin, Tree, message, notification } from "antd";
import React, { useContext, useEffect } from "react";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { ManageRolesContext } from "../Pages/Roles/Index";
import type { TreeProps } from "antd";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { handlersType } from "@/common/types/handlers";

export default function ModalRole({
  open,
  handlersModal,
}: {
  open: boolean;
  handlersModal: handlersType;
}) {
  const [form] = Form.useForm();
  const {
    session,
    state: [state, dispatch],
    resModuleList,
    resTable,
    createRole
  }: any = useContext(ManageRolesContext);

  // fetch role by id
  const { data: detailRole, isLoading: isLoadingRole, mutate: mutateDetailRole } = useSWRFetcher<any>({
    key: state.roleId && [`api/role/${state.roleId}`],
  });

  const treeData = resModuleList.data?.map((item: any) => ({
    title: item.name,
    key: `${item.id}`,
    children: item?.permissions?.map((permission: any) => ({
      title: permission.name,
      key: `${permission.id}`,
    })),
  }));

  if (state.formType === "edit") {
    form.setFieldValue("name", detailRole?.name);
  }

  const updateRole = useSWRMutationFetcher({
    key: [`update:api/role`],
    axiosOptions: {
      method: 'PUT',
      url: `api/role/${state.roleId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification['success']({
          message: 'Success',
          description: 'Role data has been updated',
        });
      },
    },
  });

  useEffect(() => {
    if (open && state.formType === "edit") {
      let permissionList =
        detailRole?.permissions?.map((permission: any) => permission.id) ?? [];
      dispatch({
        type: "set permissionIds",
        payload: permissionList,
      });
    }
  }, [open, isLoadingRole, detailRole, state.formType]);

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    
    // Filter out only the child nodes that are checked
    const checkedChildNodes = info.checkedNodes
      .filter((node) => !node.children) // Only nodes without children
      .map((node) => node.key); // Get the keys of these child nodes

    // Update the state with only child node keys
    dispatch({
      type: "set permissionIds",
      payload: checkedChildNodes,
    });
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const data: any = {
        data: { ...values, permissionIds: state.permissionIds },
      }

      if (state.formType === "edit") {
        await updateRole.trigger(data);
        await mutateDetailRole();                     
      } else {
        await createRole.trigger(data);
      }

      await resTable.mutate();

      form.resetFields();
      handlersModal.close();

    } catch (error) {
      message.error("Form submission failed. Please check your inputs.");
    }
  };

  return (
    <>
      <Modal
        title={`${state.formType === "add" ? "Add New Role" : "Edit Role"}`}
        open={open}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => {
          handlersModal.close();
          dispatch({ type: "set formType", payload: undefined });
          dispatch({ type: "set roleId", payload: undefined });
          dispatch({
            type: "set permissionIds",
            payload: [],
          });
          form.resetFields();
        }}
      >
        <Spin size="large" spinning={isLoadingRole}>
          <Divider />
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Role Name"
              name="name"
              rules={[
                { required: true, message: "Role Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="text" placeholder="Admin" />
            </Form.Item>
            <Form.Item
              label="Role Permissions"
            >
              <Tree
                checkable
                checkedKeys={state.permissionIds}
                selectable={false}
                onCheck={onCheck}
                treeData={treeData}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
