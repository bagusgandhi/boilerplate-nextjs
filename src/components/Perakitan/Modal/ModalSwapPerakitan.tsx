import { Form, Modal, Select, message } from "antd";
import React, { useContext, useEffect } from "react";
import { PerakitanListContext } from "../Pages/Index";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { flowMapReverse } from "@/utils/const/flowMap";
import { handlersType } from "@/common/types/handlers";
export default function ModalSwapPerakitan({
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
    resTableTrain,
    updateAsset,
  }: any = useContext(PerakitanListContext);

  const resOptions = useSWRFetcher<any>({
    key: state.filter.parent_asset_type && {
      url: "api/asset",
      params: {
        asset_types: [state.filter.parent_asset_type],
        viewAll: true,
        order: "created_at:DESC",
      },
    },
    // axiosOptions: {
    //   url: "api/asset",
    //   params: {
    //     asset_types: [state.filter.parent_asset_type],
    //     viewAll: true,
    //     order: "created_at:DESC",
    //   },
    // },
  });

  // useEffect(() => {
  //   resOptions.mutate();
  // }, [state.filter.parent_asset_type]);

  const options = resOptions.data?.results?.map((item: any) => ({
    label: item?.name,
    value: item.id,
  }));

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      console.log(values)

      const data: any = {
        data: {
          name: state.assetName,
          asset_type: state.filter.asset_type,
          parent_asset_id: values.name,
        },
      };

      // console.log(data);
      // console.log("current", state.selectedAssetId);
      // console.log("current_parrent", state.selectedParentAssetId);

      await updateAsset.trigger(data);
      await resTableTrain.mutate();

      form.resetFields();
      handlersModal.close();
    } catch (error) {
      // console.log(error);
      message.error("Form submission failed. Please check your inputs.");
    }
  };
  return (
    <>
      <Modal
        title="Ubah ID Asset / Sparepart Parent"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          dispatch({
            type: "set assetName",
            payload: undefined,
          });

          dispatch({
            type: "set filter.parent_asset_type",
            payload: undefined,
          });

          dispatch({
            type: "set filter.asset_type",
            payload: undefined,
          });

          dispatch({
            type: "set assetId",
            payload: undefined,
          });

          handlersModal.close();
          form.resetFields();
        }}
        maskClosable={false}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Pindahkan ke ID Asset / Sparepart Parent Lain"
            name="name"
            rules={[{ required: true, message: "ID Asset / Sparepart is required" }]}
          >
            <Select
              showSearch
              placeholder="Pilih atau Masukkan ID Asset / Sparepart"
              allowClear
              loading={resOptions.isLoading}
              options={options ?? []}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => {
                form.setFieldValue("name", value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
