import { useHasPermission } from "@/utils/hooks/usePermission";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { useDisclosure } from "@mantine/hooks";
import { notification } from "antd";
import Search from "antd/es/transfer/search";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";

export default function AssetManagement({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [openedModal, handlersModal] = useDisclosure(false);

  const canViewAllAsset = useHasPermission({
    requiredPermission: ["assetManagement.viewAllAsset"],
    session,
  });

  const resTable = useSWRFetcher<any>({
    key: [`api/asset`],
    axiosOptions: {
      params: {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filter.search,
      },
    },
  });

  const createAsset = useSWRMutationFetcher({
    key: [`create:api/asset`],
    axiosOptions: {
      method: 'POST',
      url: `api/asset`,
    },
    swrOptions: {
      onSuccess: (data: any) => {
        notification['success']({
          message: 'Success',
          description: 'New Asset has been created',
        });
      },
    },
  });

  return (
    <>
      <ManageAssetContext.Provider
        value={{
          state: [state, dispatch],
          session,
          resTable,
          createAsset,
          page: "asset",
        }}
      >
        <div className="flex flex-col gap-4 bg-white p-6">
          {/* <Search
            placeholder="Search rfid, name"
            context={ManageAssetContext}
            handlersModal={handlersModal}
          /> */}
          {/* {canViewAllAsset && <TableListUsers handlersModal={handlersModal} />} */}

          {/* <ModalUser open={openedModal} handlersModal={handlersModal} /> */}
        </div>
      </ManageAssetContext.Provider>
    </>
  );
}

export const ManageAssetContext = createContext<any | undefined>(undefined);

interface initialStateType {
  loading: boolean;
  formType: string | undefined;
  moduleId: string | undefined;
  permissionId: string | undefined;
  selectedModule: string | undefined;
  pagination: {
    limit: number;
    page: number;
  };
  filter: {
    search: string | undefined;
  };
}

const initialState: initialStateType = {
  loading: false,
  formType: undefined,
  moduleId: undefined,
  permissionId: undefined,
  selectedModule: undefined,
  pagination: {
    limit: 10,
    page: 1,
  },
  filter: {
    search: undefined,
  },
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
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
    case "set pagination":
      draft.pagination = action.payload;
      break;
    case "set filter.search":
      draft.filter.search = action.payload;
      break;
  }
}
