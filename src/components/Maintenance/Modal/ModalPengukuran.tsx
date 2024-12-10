import { Form, Input, Modal, message } from "antd";
import React, { useContext } from "react";
import { MaintenanceAddContext } from "../Pages/Index";
import { flowMapReverse } from "@/utils/const/flowMap";
import { handlersType } from "@/common/types/handlers";

export default function ModalPengukuran({
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
    resAssetDetail,
    updateAsset,
  }: any = useContext(MaintenanceAddContext);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const data: any = {
        data: {
          name: state.selectedAssetName,
          asset_type: "Keping Roda",
          paramsValue: values,
          flow: flowMapReverse[state.stepperStats],
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

  form.setFieldValue("diameter", state?.paramsValue?.diameter);
  form.setFieldValue("flens", state?.paramsValue?.flens);

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
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 4 }}
          style={{ maxWidth: 600, marginTop: 20 }}
        >
          <Form.Item
            label="Diameter"
            name="diameter"
            rules={[{ required: true, message: "Please input your diameter!" }]}
          >
            <Input type="number" min={1} max={1000} />
          </Form.Item>
          <Form.Item
            label="Flens"
            name="flens"
            rules={[{ required: true, message: "Please input your flens!" }]}
          >
            <Input type="number" min={1} max={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
