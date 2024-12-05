import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import React, { useContext } from "react";
import { MaintenanceAddContext } from "../Pages/Add/Index";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { flowMapReverse } from "@/utils/const/flowMap";

export default function ModalLokasiSimpan({
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
    resAssetDetail,
    updateAsset
  }: any = useContext(MaintenanceAddContext);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const data: any = {
        data: {
          name: state.selectedAssetName,
          asset_type: "Keping Roda",
          location: values?.location?.toLowerCase(),
          flow: flowMapReverse[state.stepperStats],
          parent_asset_id: null
        },
      };

      await updateAsset.trigger(data);
      await resAssetDetail.mutate();

      form.resetFields();
      handlersModal.close();
    } catch (error) {
      message.error("Form submission failed. Please check your inputs.");
    }
  };
  return (
    <>
      <Modal
        title="Masukan Hasil Pengukuran"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          dispatch({
            type: "set selectedAssetId",
            payload: undefined,
          });

          dispatch({
            type: "set paramsValue",
            payload: undefined,
          });

          dispatch({
            type: "set selectedAssetName",
            payload: undefined,
          });

          handlersModal.close();
          form.resetFields();
        }}
        maskClosable={false}
      >
        <Form layout="horizontal" form={form}>
          <Form.Item 
            label="Lokasi" 
            name="location"
            rules={[{ required: true, message: "Please input your location!" }]}
          >
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
