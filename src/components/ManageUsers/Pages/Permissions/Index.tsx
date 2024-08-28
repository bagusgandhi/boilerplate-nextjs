"use client";
import {
  DeleteOutlined,
  EditOutlined,
  NumberOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import {
  Avatar,
  Button,
  Collapse,
  List,
  Popconfirm,
  Spin,
  notification,
} from "antd";
import type { CollapseProps } from "antd";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";
import ModalModule from "../../Modal/ModalModule";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import ModalPermission from "../../Modal/ModalPermission";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function ManagePermissions({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModalModule, handlersModalModule] = useDisclosure(false);
  const [openedModalPermission, handlersModalPermission] = useDisclosure(false);

  const resModule = useSWRFetcher<any>({
    key: [`api/module`],
  });

  const canViewAllModule = useHasPermission({
    requiredPermission: ["userManagement.viewAllModules"],
    session,
  });

  const canAddModule = useHasPermission({
    requiredPermission: ["userManagement.addNewModule"],
    session,
  });

  const canDeleteModule = useHasPermission({
    requiredPermission: ["userManagement.deleteModule"],
    session,
  });

  const canAddPermission = useHasPermission({
    requiredPermission: ["userManagement.addPermission"],
    session,
  });

  const canUpdatePermission = useHasPermission({
    requiredPermission: ["userManagement.updatePermission"],
    session,
  });

  const canDeletePermission = useHasPermission({
    requiredPermission: ["userManagement.deletePermission"],
    session,
  });

  const createModule = useSWRMutationFetcher({
    key: [`create:api/module`],
    axiosOptions: {
      method: "POST",
      url: `api/module`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "New Module has been created",
        });
      },
    },
  });

  const deleteModule = useSWRMutationFetcher({
    key: [`delete:api/module`],
    axiosOptions: {
      method: "DELETE",
      url: `api/module/${state.moduleId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Module has been deleted",
        });
      },
    },
  });

  const deletePermission = useSWRMutationFetcher({
    key: [`delete:api/module`],
    axiosOptions: {
      method: "DELETE",
      url: `api/permission/${state.permissionId}`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "Permission has been deleted",
        });
      },
    },
  });

  const createPermission = useSWRMutationFetcher({
    key: [`create:api/permission`],
    axiosOptions: {
      method: "POST",
      url: `api/permission`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification["success"]({
          message: "Success",
          description: "New Permission has been created",
        });
      },
    },
  });

  const genExtra = (moduleId: string) => (
    canDeleteModule && (<Popconfirm
      placement="bottom"
      title={"Warning"}
      description={"Are you sure to delete this module ?"}
      okText="Yes"
      cancelText="No"
      onConfirm={async () => {
        await deleteModule.trigger();
        await resModule.mutate();
      }}
    >
      <Button
        onClick={() => {
          dispatch({
            type: "set moduleId",
            payload: moduleId,
          });
        }}
        danger
        size="small"
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>
    </Popconfirm>)
  );

  const listPermission = (permissions: any) => (
    <>
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={permissions}
        renderItem={(record: any, index) => (
          <List.Item
            actions={[
              canUpdatePermission && (<Button
                onClick={() => {
                  dispatch({
                    type: "set formType",
                    payload: "edit:permission",
                  });
                  dispatch({
                    type: "set permissionId",
                    payload: record.id,
                  });
                  handlersModalPermission.open();
                }}
                size="small"
                icon={<EditOutlined />}
              >
                Edit
              </Button>),
              ( canDeletePermission && <Popconfirm
                placement="bottom"
                title={"Warning"}
                description={
                  'Are you sure to delete "' + record?.name + '" permission ?'
                }
                okText="Yes"
                cancelText="No"
                onConfirm={async () => {
                  await deletePermission.trigger();
                  await resModule.mutate();
                }}
              >
                <Button
                  onClick={() => {
                    dispatch({
                      type: "set permissionId",
                      payload: record.id,
                    });
                  }}
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>),
            ]}
          >
            <List.Item.Meta avatar={<NumberOutlined />} title={record.name} />
          </List.Item>
        )}
      />
    </>
  );

  return (
    <>
      <ManagePermissionsContext.Provider
        value={{
          state: [state, dispatch],
          resModule,
          createModule,
          createPermission,
        }}
      >
        <div className="flex flex-col gap-4 bg-white p-6">
          <div className="flex gap-2 justify-end">
            { canAddModule && (<Button
              type="primary"
              loading={resModule?.isLoading}
              onClick={() => {
                dispatch({ type: "set formType", payload: "add:module" });
                handlersModalModule.open();
              }}
              icon={<PlusOutlined />}
            >
              Add New Module
            </Button>)}
            { canAddPermission && <Button
              type="primary"
              loading={resModule?.isLoading}
              onClick={() => {
                dispatch({ type: "set formType", payload: "add:permission" });
                handlersModalPermission.open();
              }}
              icon={<PlusOutlined />}
            >
              Add New Permission
            </Button>}
          </div>
          <Spin spinning={resModule?.isLoading}>
            { canViewAllModule && (<Collapse
              collapsible="header"
              accordion
              bordered={false}
              items={resModule?.data?.map((item: any) => ({
                key: item.id,
                label: <p className="font-bold">{item.name}</p>,
                extra: genExtra(item.id),
                children: listPermission(item.permissions),
              }))}
              size="large"
            />)}
            <ModalModule
              open={openedModalModule}
              handlersModal={handlersModalModule}
            />
            <ModalPermission
              open={openedModalPermission}
              handlersModal={handlersModalPermission}
            />
          </Spin>
        </div>
      </ManagePermissionsContext.Provider>
    </>
  );
}

export const ManagePermissionsContext = createContext<any | undefined>(
  undefined
);

interface initialStateType {
  loading: boolean;
  formType: string | undefined;
  moduleId: string | undefined;
  permissionId: string | undefined;
  selectedModule: string | undefined;
}

const initialState: initialStateType = {
  loading: false,
  formType: undefined,
  moduleId: undefined,
  permissionId: undefined,
  selectedModule: undefined,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set selectedModule":
      draft.selectedModule = action.payload;
      break;
    case "set permissionId":
      draft.permissionId = action.payload;
      break;
    case "set moduleId":
      draft.moduleId = action.payload;
      break;
    case "set formType":
      draft.formType = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
