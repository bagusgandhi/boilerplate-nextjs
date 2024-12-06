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
import React, { useContext } from "react";
import { SparepartListContext } from "../Pages/Index";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";

export default function ModalSparepart({
  open,
  handlersModal,
  isAsset = false
}: {
  open: boolean;
  handlersModal: any;
  isAsset?: boolean
}) {
  const [form] = Form.useForm();
  const {
    session,
    state: [state, dispatch],
    resTable,
  }: any = useContext(SparepartListContext);

  // fetch user by id
  const {
    data: detailAsset,
    isLoading: isLoadingAsset,
    mutate: mutateDetailAsset,
  } = useSWRFetcher<any>({
    key: state.assetId && [`api/asset/${state.assetId}`],
  });

  if (state.formType === "edit") {
    form.setFieldValue("name", detailAsset?.name);
    form.setFieldValue("rfid", detailAsset?.rfid);
    form.setFieldValue("asset_type", detailAsset?.asset_type);
    form.setFieldValue("parent_asset_id", detailAsset?.parent_asset?.id);
    form.setFieldValue("bogie", detailAsset?.bogie);
    form.setFieldValue("factory", detailAsset?.factory);
    form.setFieldValue("carriage_type", detailAsset?.carriage_type);
  }

  const AssetTypeOptions = [
    {
      value: "Train Set",
      label: "Train Set",
    },
    {
      value: "Gerbong",
      label: "Gerbong",
    },
    {
      value: "Bogie",
      label: "Bogie",
    }
  ];

  const SparePartTypeOptions = [
    {
      value: "Keping Roda",
      label: "Keping Roda",
    },
  ];

  const GerbongTypeOptions = [
    {
      value: "GB",
      label: "GB",
    },
    {
      value: "GT",
      label: "GT",
    },
  ];

  const FactoryOptions: any = {
    GB: [
      {
        label: "GB - KKBW 45T (CANADA)",
        value: "GB - KKBW 45T (CANADA)",
      },
      {
        label: "GB - KKBW 50T (CANADA)",
        value: "GB - KKBW 50T (CANADA)",
      },
      {
        label: "GB - KKBW 50T (CHINA)",
        value: "GB - KKBW 50T (CHINA)",
      },
      {
        label: "GB - KKBW 50T (INKA)",
        value: "GB - KKBW 50T (INKA)",
      },
      {
        label: "GB - ZZOW 50T",
        value: "GB - ZZOW 50T",
      },
    ],
    GT: [
      {
        label: "GT - ZZOW 50T",
        value: "GT - ZZOW 50T",
      },
    ],
  };

  const BogieTypeOptions = [
    {
      value: "1.1",
      label: "Bogie 1.1",
    },
    {
      value: "1.2",
      label: "Bogie 1.2",
    },
    {
      value: "1.3",
      label: "Bogie 1.3",
    },
    {
      value: "1.4",
      label: "Bogie 1.4",
    },
    {
      value: "2.1",
      label: "Bogie 2.1",
    },
    {
      value: "2.2",
      label: "Bogie 2.2",
    },
    {
      value: "2.3",
      label: "Bogie 2.3",
    },
    {
      value: "2.4",
      label: "Bogie 2.4",
    },
  ];

  // watch
  const selectedAssetType = Form.useWatch("asset_type", form);
  const selectedGerbongType = Form.useWatch("carriage_type", form);

  const asseTypeParentMap: any = {
    Gerbong: "Train Set",
    Bogie: "Gerbong",
    "Keping Roda": "Bogie",
  };

  // fetch berdasarkan assetType
  const resAssetParent = useSWRFetcher<any>({
    key:
      selectedAssetType !== "Train Set"
        ? [`api/asset?asset_type=${selectedAssetType}`]
        : undefined,
    axiosOptions: {
      url: "api/asset",
      params: {
        asset_type: asseTypeParentMap[selectedAssetType],
        viewAll: true,
        order: "name:ASC",
      },
    },
  });

  const createSparepart = useSWRMutationFetcher({
    key: [`create:api/asset`],
    axiosOptions: {
      method: "POST",
      url: `api/asset`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Sparepart data has been created",
        });
      },
    },
  });

  const updateUser = useSWRMutationFetcher({
    key: [`update:api/asset`],
    axiosOptions: {
      method: "PATCH",
      url: `api/asset/${state.assetId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Asset data has been updated",
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
        },
      };

      if (state.formType === "edit") {
        await updateUser.trigger(data);
        await mutateDetailAsset();
      } else {
        await createSparepart.trigger(data);
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
        title={`${
          state.formType === "add" ? `Tambah ${isAsset ? 'Asset' : 'Sparepart'}` : `Edit ${isAsset ? 'Asset' : 'Sparepart'}`
        }`}
        open={open}
        onOk={handleOk}
        maskClosable={false}
        onCancel={() => {
          handlersModal.close();
          dispatch({ type: "set formType", payload: undefined });
          form.resetFields();
        }}
      >
        <Spin
          size="large"
          spinning={isLoadingAsset}
        >
          <Divider />
          <Form layout="vertical" form={form}>
            <Form.Item
              label="ID Sparepart"
              name="name"
              rules={[
                { required: true, message: "Name is required" },
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="text" placeholder="KP100201" />
            </Form.Item>
            <Form.Item
              label="Rfid"
              name="rfid"
              rules={[
                {
                  whitespace: true,
                  message: "Hindari Menggunakan Spasi di awal",
                },
              ]}
            >
              <Input type="text" placeholder="rfid.." />
            </Form.Item>

            <Form.Item
              label="Tipe"
              name="asset_type"
              rules={[{ required: true, message: "Tipe is required" }]}
            >
              <Select
                placeholder="Select Tipe"
                allowClear
                options={isAsset ? AssetTypeOptions : SparePartTypeOptions}
                onChange={(value) => {
                  form.setFieldValue("asset_type", value);
                  form.setFieldValue("bogie", undefined);
                  form.setFieldValue("carriage_type", undefined);
                  form.setFieldValue("parent_asset_id", undefined);
                }}
              />
            </Form.Item>

            {selectedAssetType === "Bogie" && (
              <Form.Item
                label="Tipe Bogie"
                name="bogie"
                rules={[{ required: true, message: "Bogie is required" }]}
              >
                <Select
                  placeholder="Select Bogie"
                  allowClear
                  options={BogieTypeOptions}
                  onChange={(value) => {
                    form.setFieldValue("bogie", value);
                    form.setFieldValue("parent_asset_id", undefined);
                  }}
                />
              </Form.Item>
            )}

            {selectedAssetType === "Gerbong" && (
              <Form.Item
                label="Tipe Gerbong"
                name="carriage_type"
                rules={[{ required: true, message: "Bogie is required" }]}
              >
                <Select
                  placeholder="Select Tipe Gerbong"
                  allowClear
                  options={GerbongTypeOptions}
                  onChange={(value) => {
                    form.setFieldValue("carriage_type", value);
                    form.setFieldValue("factory", undefined);
                  }}
                />
              </Form.Item>
            )}

            {selectedAssetType === "Gerbong" && (
              <Form.Item
                label="Pabrikan"
                name="factory"
                rules={[{ required: true, message: "Bogie is required" }]}
              >
                <Select
                  placeholder="Select Pabrikan"
                  allowClear
                  disabled={selectedGerbongType ? false : true}
                  options={FactoryOptions[selectedGerbongType] ?? []}
                  onChange={(value) => {
                    form.setFieldValue("factory", value);
                  }}
                />
              </Form.Item>
            )}

            {selectedAssetType !== "Train Set" && (
              <Form.Item label="Parent" name="parent_asset_id">
                <Select
                  placeholder="Select Parent"
                  allowClear
                  options={
                    resAssetParent?.data?.results?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) ?? []
                  }
                  onChange={(value) => {
                    form.setFieldValue("parent_asset_id", value);
                  }}
                />
              </Form.Item>
            )}

            <div
            // className={`flex flex-col gap-4 ${!isEditedPassword && "mb-4"}`}
            >
              {/* {state.formType === "edit" && (
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
              )} */}
              {/* {(state.formType === "add" || isEditedPassword) && (
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
              )} */}
            </div>

            {/* {canViewRoles && (
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
            )} */}
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
