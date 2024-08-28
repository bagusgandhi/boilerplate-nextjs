"use client";
import {
  Button,
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
import { ManageUsersContext } from "../Pages/Users/Index";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useToggle } from "@mantine/hooks";
import { ManagePermissionsContext } from "../Pages/Permissions/Index";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";

export default function ModalModule({
  open,
  handlersModal,
}: {
  open: boolean;
  handlersModal: any;
}) {
  const [form] = Form.useForm();
  const {
    state: [state, dispatch],
    resModule,
    createModule
  }: any = useContext(ManagePermissionsContext);

  // const canViewRoles = useHasPermission({
  //   requiredPermission: ["user.viewAllRoles"],
  //   session,
  // });



  // fetch roles data
  // const { data: dataRoles, isLoading: isLoadingRoles } = useSWRFetcher<any>({
  //   key: [`api/role?viewAll=true`],
  //   axiosOptions: {
  //     url: "api/role",
  //     params: {
  //       viewAll: true,
  //     },
  //   },
  // });

  // fetch user by id
  // const { data: detailModule, isLoading: isLoadingModule } = useSWRFetcher<any>({
  //   key: state.moduleId && [`api/user/${state.moduleId}`],
  // });

  // if (state.formType === "edit") {
    // form.setFieldValue("name", detailModule?.name);
  // }


  const handleOk = async () => {
    try {
      // Trigger form validation and submission
      await form.validateFields();
      const values = form.getFieldsValue();

      const data: any = {
        data: { ...values },
      }

      await createModule.trigger(data);
      await resModule.mutate();

      form.resetFields(); // Clear the form fields
      handlersModal.close();

    } catch (error) {
      message.error("Form submission failed. Please check your inputs.");
    }
  };

  return (
    <>
      <Modal
        title={`${state.formType === "add" ? "Add New Module" : "Edit Module"}`}
        open={open}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => {
          handlersModal.close();
          dispatch({ type: "set formType", payload: undefined });
          form.resetFields();
        }}
      >
        <Spin size="large" spinning={false}>
          <Divider />
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Module Name"
              name="name"
              rules={[
                { required: true, message: "Module Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="text" placeholder="User Management" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
