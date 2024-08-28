"use client";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";
import TableListUsers from "../../Table/TableListUsers";
import Search from "../../Filter/Search";
import { useHasPermission } from "@/utils/hooks/usePermission";
import { useDisclosure } from "@mantine/hooks";
import ModalUser from "../../Modal/ModalUser";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { notification } from "antd";
// import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";

export default function ManageUser({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);

  const canViewListUser = useHasPermission({
    requiredPermission: ["userManagement.viewListOfUser"],
    session,
  });

  const resTable = useSWRFetcher<any>({
    key: [`api/user`],
    axiosOptions: {
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search,
        roleId: state.filter.roleId
      },
    },
  });

  const createUser = useSWRMutationFetcher({
    key: [`create:api/user`],
    axiosOptions: {
      method: 'POST',
      url: `api/user`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification['success']({
          message: 'Success',
          description: 'New User has been created',
        });
      },
    },
  });

  return (
    <>
      <ManageUsersContext.Provider
        value={{ state: [state, dispatch], session, resTable, createUser, page: 'user' }}
      >
        <div className="flex flex-col gap-4 bg-white p-6">
          <Search
            placeholder="Search name, email, or role"
            context={ManageUsersContext}
            handlersModal={handlersModal}
          />
          {canViewListUser && <TableListUsers handlersModal={handlersModal} />}

          <ModalUser open={openedModal} handlersModal={handlersModal} />
        </div>
      </ManageUsersContext.Provider>
    </>
  );
}

export const ManageUsersContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  formType: string | undefined;
  userId: string | undefined;
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    search: string | undefined;
    roleId: string[] | undefined
  }
}

const initialState: initialStateType = {
  loading: false,
  formType: undefined,
  userId: undefined,
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    search: undefined,
    roleId: undefined
  }
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set filter.roleId":
      draft.filter.roleId = action.payload;
      break;
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set userId":
      draft.userId = action.payload;
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
