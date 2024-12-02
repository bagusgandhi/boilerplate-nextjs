"use client";
import { useSWRFetcher } from "@/utils/hooks/useSwrFetcher";
import { Steps, message } from "antd";
import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { useSearchParams, useRouter } from "next/navigation";

export default function Index({ id }: { id: string }) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase"); // Retrieve the 'phase' query param
  // console.log("phase", phase);

  useEffect(() => {
    const parsedPhase = parseInt(phase!);

    if (isNaN(parsedPhase) || parsedPhase < 0 || parsedPhase > 4) {
      message.error("Invalid phase. Redirecting to Maintenance Page");
      router.push("/dashboard/maintenance");
    }

    dispatch({
      type: "set stepperStats",
      payload: parsedPhase,
    });
  }, [phase]);

  const resFlow = useSWRFetcher<any>({
    key: [`api/flow`],
    axiosOptions: {
      params: {
        order: "position:ASC",
      },
    },
  });

  const stepperItem = resFlow?.data?.results?.map((item: any) => ({
    title: item.name,
    description: item.description,
  }));

  return (
    <>
      <div className="flex flex-col gap-8 bg-white p-8 mt-6">
        <Steps current={state.stepperStats} items={stepperItem ?? []} />
      </div>
    </>
  );
}

interface initialStateType {
  stepperStats: number;
}

const initialState: initialStateType = {
  stepperStats: 0,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case "set stepperStats":
      draft.stepperStats = action.payload;
      break;
  }
}
