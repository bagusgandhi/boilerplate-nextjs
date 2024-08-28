"use client"
import { Button, Form, Input, Divider } from "antd";
import React from "react";
import { useImmerReducer } from "use-immer";
import { signIn } from 'next-auth/react';

type FieldType = {
  email?: string;
  password?: string;
};

export default function Auth() {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);

  const onFinish = async (values: any) => {
    dispatch({ type: 'set loading', payload: true });
    await signIn('cred-email-password', { ...values, callbackUrl: '/dashboard' })

    dispatch({ type: 'set loading', payload: false });
  };
  return (
    <div className="container mx-auto h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="w-1/2 lg:w-1/3 ">
          <h1 className="font-bold text-2xl text-center my-4">Login</h1>
          <Divider />
          <Form
            name="basic"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            // style={{ maxWidth: 600 }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ width: "100%" }}
          >
            <Form.Item<FieldType>
              // label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your email!",
                },
              ]}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="Email"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>

            <Form.Item<FieldType>
              // placeholder="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}> */}
            <Form.Item style={{ width: "100%" }}>
              <Button loading={state.loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}


interface initialStateType {
  loading: boolean;
}

const initialState: initialStateType = {
  loading: false,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set loading':
      draft.loading = action.payload;
      break;
  }
}