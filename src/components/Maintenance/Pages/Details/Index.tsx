"use client";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { Steps, message, notification } from "antd";
import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { useSearchParams, useRouter } from "next/navigation";
import { useSWRMutationFetcher } from "@/utils/hooks/useSweFetcherMutation";
import { flowMap } from "@/utils/const/flowMap";

export default function Index({ id, withHeader }: { id: string, withHeader?: boolean }) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const phase = searchParams.get("phase"); // Retrieve the 'phase' query param
  // console.log("phase", phase);

  // useEffect(() => {
  //   const parsedPhase = parseInt(phase!);

  //   if (isNaN(parsedPhase) || parsedPhase < 0 || parsedPhase > 4) {
  //     message.error("Invalid phase. Redirecting to Maintenance Page");
  //     router.push("/dashboard/maintenance");
  //   }

  //   dispatch({
  //     type: "set stepperStats",
  //     payload: parsedPhase,
  //   });
  // }, [phase]);

  // const resAssetDetail = useSWRFetcher<any>({
  //   key: state.filter.assetId && [`api/asset/${state.filter.assetId}`],
  // });

  const resFlow = useSWRFetcher<any>({
    key: [`api/flow`],
    axiosOptions: {
      params: {
        order: "position:ASC",
      },
    },
  });

  const resMaintenanceDetail = useSWRFetcher<any>({
    key: id && [`api/maintenance/${id}`],
  });

  useEffect(() => {
    if (resMaintenanceDetail?.data) {
      dispatch({
        type: "set stepperStats",
        payload: flowMap[resMaintenanceDetail?.data?.flow?.name],
      });
    }
  }, [resMaintenanceDetail?.data]);

  

  const stepperItem = resFlow?.data?.results?.map((item: any) => ({
    title: item.name,
    description: item.description,
  }));

  return (
    <>
      {withHeader &&(<div className="flex flex-col gap-8 bg-white p-8 mt-6">
        <Steps current={state.stepperStats} items={stepperItem ?? []} />
      </div>)}

      {/* inisialisasi */}
      {state.stepperStats === 0 && (
        <div>
          <p>inisialisasi</p>
        </div>
      )}

      {/* pengukuran */}
      {state.stepperStats === 1 && (
        <div>
          <p>pengukuran</p>
        </div>
      )}

      {/* engineering */}
      {state.stepperStats === 2 && (
        <div>
          <p>engineering</p>
        </div>
      )}

      {/* penyimpanan */}
      {state.stepperStats === 3 && (
        <div>
          <p>penyimpanan</p>
        </div>
      )}

      {/* assembly */}
      {state.stepperStats === 4 && (
        <div>
          <p>assembly</p>
        </div>
      )}
    </>
  );
}

interface initialStateType {
  stepperStats: number;
  isSaved?: boolean;
  selectedAssetId: string | undefined;
  selectedParentAssetId: string | undefined;
  paramsValue: Record<string, any> | undefined;
  selectedAssetName: string | undefined;
}

const initialState: initialStateType = {
  stepperStats: 0,
  isSaved: false,
  selectedAssetId: undefined,
  selectedParentAssetId: undefined,
  paramsValue: undefined,
  selectedAssetName: undefined
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set selectedAssetName":
      draft.selectedAssetName = action.payload;
      break;
    case "set paramsValue":
      draft.paramsValue = action.payload;
      break;
    case "set selectedParentAssetId":
      draft.selectedParentAssetId = action.payload;
      break;
    case "set selectedAssetId":
      draft.selectedAssetId = action.payload;
      break;
    case "set stepperStats":
      draft.stepperStats = action.payload;
      break;
    case "set filter.assetId":
      draft.filter.assetId = action.payload;
      break;
    case "set filter.flow":
      draft.filter.flow = action.payload;
      break;
    case "set isSaved":
      draft.isSaved = action.payload;
      break;
    case "set loading":
      draft.loading = action.payload;
      break;
  }
}
