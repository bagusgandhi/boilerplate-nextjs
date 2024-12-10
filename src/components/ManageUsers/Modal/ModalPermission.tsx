"use client";
import {
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  message,
  notification,
} from "antd";
import React, { useContext, useEffect } from "react";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { ManagePermissionsContext } from "../Pages/Permissions/Index";
import _ from "lodash";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { handlersType } from "@/common/types/handlers";

export default function ModalPermission({
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
    resModule,
    createPermission
  }: any = useContext(ManagePermissionsContext);

  // const canViewRoles = useHasPermission({
  //   requiredPermission: ["user.viewAllRoles"],
  //   session,
  // });

  // fetch permission by id
  const { data: detailPermission, isLoading: isLoadingPermission, mutate: mutateDetailPermission } = useSWRFetcher<any>({
    key: state.permissionId && [`api/permission/${state.permissionId}`],
  });

  if (state.formType === "edit:permission") {
    form.setFieldValue("name", detailPermission?.name);
    form.setFieldValue("modulesId", detailPermission?.module?.id);
    form.setFieldValue("action", detailPermission?.action);
  }

  const updatePermission = useSWRMutationFetcher({
    key: [`update:api/role`],
    axiosOptions: {
      method: 'PUT',
      url: `api/permission/${state.permissionId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification['success']({
          message: 'Success',
          description: 'Permission has been updated',
        });
      },
    },
  });

  useEffect(() => {
    if(open && state.formType === "edit:permission"){
      dispatch({
        type: "set selectedModule",
        payload: detailPermission?.module?.name,
      });
    }
  }, [open, isLoadingPermission])

  const handleOk = async () => {
    try {

      await form.validateFields();
      const values = form.getFieldsValue();
      const data: any = {
        data: { ...values },
      }

      if (state.formType === "edit:permission") {
        await updatePermission.trigger(data);
        await mutateDetailPermission();                     
      } else {
        await createPermission.trigger(data);
      }

      await resModule.mutate()

      form.resetFields(); // Clear the form fields
      handlersModal.close();

    } catch (error) {
      message.error("Form submission failed. Please check your inputs.");
    }
  };

  return (
    <>
      <Modal
        title={`${
          state.formType === "add" ? "Add New Permission" : "Edit Permission"
        }`}
        open={open}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => {
          handlersModal.close();
          dispatch({ type: "set formType", payload: undefined });
          dispatch({ type: 'set selectedModule', payload: undefined})
          form.resetFields();
        }}
      >
        <Spin size="large" spinning={isLoadingPermission}>
          <Divider />
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Permission Name"
              name="name"
              rules={[
                { required: true, message: "Permission Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  form.setFieldValue(
                    "action",
                    `${_.camelCase(state.selectedModule)}.${_.camelCase(
                      e.target.value
                    )}`
                  );
                }}
                type="text"
                placeholder="User Management"
              />
            </Form.Item>
            <Form.Item
              label="Module"
              name="modulesId"
              rules={[{ required: true, message: "Option Module is required" }]}
            >
              <Select
                showSearch={true}
                allowClear
                options={resModule?.data?.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Select Modul"
                onSelect={(value, option: any) => {
                  form.setFieldValue("moduleId", value);
                  dispatch({ type: 'set selectedModule', payload: option?.label})
                  form.setFieldValue(
                    "action",
                    `${_.camelCase(option?.label)}.${_.camelCase(
                      form.getFieldValue("name")
                    )}`
                  );
                }}
                onClear={() => {
                  form.setFieldValue(
                    "action",
                    `${_.camelCase()}.${_.camelCase(
                      form.getFieldValue("name")
                    )}`
                  );
                }}
              />
            </Form.Item>
            <Form.Item
              label="Action"
              name="action"
              rules={[
                { required: true, message: "Permission Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Action (Generated)"
                readOnly
                disabled
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

