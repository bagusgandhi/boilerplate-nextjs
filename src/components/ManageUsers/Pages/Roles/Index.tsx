"use client";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";
import Search from "../../Filter/Search";
import TableListRoles from "../../Table/TableListRoles";
import { useDisclosure } from "@mantine/hooks";
import ModalRole from "../../Modal/ModalRole";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { notification } from "antd";
import { useHasPermission } from "@/utils/hooks/usePermission";

export default function ManageRoles({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);

  const canViewListRole = useHasPermission({
    requiredPermission: ["userManagement.viewAllRoles"],
    session,
  });

  const resTable = useSWRFetcher<any>({
    key: [`api/role`],
    axiosOptions: {
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search
      },
    },
  });

  const resModuleList =
  useSWRFetcher<any>({
    key: [`api/module`],
  });

  const createRole = useSWRMutationFetcher({
    key: [`create:api/role`],
    axiosOptions: {
      method: 'POST',
      url: `api/role`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification['success']({
          message: 'Success',
          description: 'New Role has been created',
        });
      },
    },
  });

  return (
    <>
      <ManageRolesContext.Provider
        value={{ state: [state, dispatch], session, resTable, resModuleList, createRole, page: 'role' }}
      >
        <div className="flex flex-col gap-4 bg-white p-6">
          <Search
            placeholder="Search role"
            context={ManageRolesContext}
            handlersModal={handlersModal}
          />
          { canViewListRole && (<TableListRoles handlersModal={handlersModal} />)}
        </div>
        <ModalRole open={openedModal} handlersModal={handlersModal} />
      </ManageRolesContext.Provider>
    </>
  );
}

export const ManageRolesContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  formType: string | undefined;
  roleId: string | undefined;
  permissionIds: string[] | undefined;
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    search: string | undefined
  }
}

const initialState: initialStateType = {
  loading: false,
  formType: undefined,
  roleId: undefined,
  permissionIds: [],
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    search: undefined
  }
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set permissionIds":
      draft.permissionIds = action.payload;
      break;
    case "set roleId":
      draft.roleId = action.payload;
      break;
    case "set pagination":
      draft.pagination = action.payload;
      break;
    case "set formType":
      draft.formType = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
