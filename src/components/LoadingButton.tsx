import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-ct-blue-700",
  children,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `w-full py-3 font-semibold ${btnColor} flex justify-center rounded-lg border-none outline-none`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${loading && "bg-[#ccc]"}`
      )}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="inline-block text-white">Loading...</span>
        </div>
      ) : (
        <span className={`text-lg font-normal ${textColor}`}>{children}</span>
      )}
    </button>
  );
};
