import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../app/store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function AlreadyLoggedInProtection({ children }: Props) {
  const jwtToken = useSelector(
    (state: RootState) => state.userDetails.jwtToken
  );
  if (jwtToken) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AlreadyLoggedInProtection;
