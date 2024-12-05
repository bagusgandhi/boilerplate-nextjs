import { Form, Modal, Select, message } from "antd";
import React, { useContext } from "react";
import { MaintenanceAddContext } from "../Pages/Add/Index";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { flowMapReverse } from "@/utils/const/flowMap";
export default function ModalSwap({
  open,
  handlersModal
}: {
  open: boolean;
  handlersModal: any;
}) {
  const [form] = Form.useForm();
  const {
    session,
    state: [state, dispatch],
    resAssetDetail,
    swapAsset
  }: any = useContext(MaintenanceAddContext);

  const resOptions = useSWRFetcher<any>({
    key: [`roda:api/asset`],
    axiosOptions: {
      url: "api/asset",
      params: {
        asset_type: "Keping Roda",
        viewAll: true,
        order: "created_at:DESC",
      },
    },
  });

  const options = resOptions.data?.results?.map((item: any) => ({
    label: item?.name,
    value: item.id,
  }));

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if(values.name === state.selectedAssetId){
        return message.error("Keping Roda tidak boleh sama");
      }

      const data: any = {
        data: {
          active_asset_id: values.name,
          inactive_asset_id: state.selectedAssetId,
          parent_asset_id: state.selectedParentAssetId,
          flow: flowMapReverse[state.stepperStats],
        },
      };


      // console.log(resAssetDetail.data);
      // console.log("current", state.selectedAssetId);
      // console.log("current_parrent", state.selectedParentAssetId);
      
      await swapAsset.trigger(data)
      await resAssetDetail.mutate()

      form.resetFields();
      handlersModal.close();
    } catch (error) {
      console.log(error);
      message.error("Form submission failed. Please check your inputs.");
    }
  };
  return (
    <>
      <Modal
        title="Perbarui Keping Roda"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          dispatch({ type: "set selectedAssetId", payload: undefined });
          dispatch({
            type: "set selectedParentAssetId",
            payload: undefined,
          });
          handlersModal.close();
          form.resetFields();
        }}
        maskClosable={false}
      >
        <Form layout="horizontal" form={form}>
          <Form.Item
            label="ID Keping Roda"
            name="name"
            rules={[{ required: true, message: "ID Keping Roda is required" }]}
          >
            <Select
              showSearch
              placeholder="Pilih atau Masukkan ID Keping Roda"
              allowClear
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
