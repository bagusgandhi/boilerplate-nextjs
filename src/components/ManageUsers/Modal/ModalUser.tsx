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
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";

export default function ModalUser({
  open,
  handlersModal,
}: {
  open: boolean;
  handlersModal: any;
}) {
  const [form] = Form.useForm();
  const {
    session,
    state: [state, dispatch],
    createUser,
    resTable,
  }: any = useContext(ManageUsersContext);
  const [isEditedPassword, toggle] = useToggle([false, true]);

  const canViewRoles = useHasPermission({
    requiredPermission: ["userManagement.viewAllRoles"],
    session,
  });

  // fetch roles data
  const { data: dataRoles, isLoading: isLoadingRoles } = useSWRFetcher<any>({
    key: [`api/role?viewAll=true`],
    axiosOptions: {
      url: "api/role",
      params: {
        viewAll: true,
      },
    },
  });

  // fetch user by id
  const {
    data: detailUser,
    isLoading: isLoadingUser,
    mutate: mutateDetailUser,
  } = useSWRFetcher<any>({
    key: state.userId && [`api/user/${state.userId}`],
  });

  const validatePasswordConfirmation = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    },
  });

  if (state.formType === "edit") {
    form.setFieldValue("name", detailUser?.name);
    form.setFieldValue("email", detailUser?.email);
    form.setFieldValue("roleId", detailUser?.roles?.[0]?.id);
  }

  const updateUser = useSWRMutationFetcher({
    key: [`update:api/user`],
    axiosOptions: {
      method: "PUT",
      url: `api/user/${state.userId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "User data has been updated",
        });
      },
    },
  });

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const data: any = {
        data: {
          ...values,
          // name: values.name,
          // email: values.email,
          // password: values.password,
          // roleId: values.roleId,
        },
      };

      if (state.formType === "edit") {
        await updateUser.trigger(data);
        await mutateDetailUser();
      } else {
        await createUser.trigger(data);
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
        title={`${state.formType === "add" ? "Add New User" : "Edit User"}`}
        open={open}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => {
          handlersModal.close();
          dispatch({ type: "set formType", payload: undefined });
          form.resetFields();
        }}
      >
        <Spin size="large" spinning={isLoadingUser}>
          <Divider />
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="text" placeholder="John Doe" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="email" placeholder="Johndoe@mail.io" />
            </Form.Item>

            <div
              className={`flex flex-col gap-4 ${!isEditedPassword && "mb-4"}`}
            >
              {state.formType === "edit" && (
                <div className="flex gap-2 items-center">
                  <p className="text-xs">
                    Do you want to edit<br></br>this user password?
                  </p>
                  <Button
                    type={isEditedPassword ? "primary" : "default"}
                    onClick={() => toggle()}
                  >
                    {isEditedPassword ? "No" : "Yes"}
                  </Button>
                </div>
              )}
              {(state.formType === "add" || isEditedPassword) && (
                <>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" },
                    ]}
                  >
                    <Input.Password placeholder="********" />
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      validatePasswordConfirmation,
                    ]}
                  >
                    <Input.Password placeholder="********" />
                  </Form.Item>
                </>
              )}
            </div>

            {canViewRoles && (
              <Form.Item label="Role" name="roleId">
                <Select
                  loading={isLoadingRoles || isLoadingUser}
                  placeholder="Select Role"
                  allowClear
                  options={dataRoles?.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={(value) => {
                    form.setFieldValue("roleId", value);
                  }}
                />
              </Form.Item>
            )}
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
