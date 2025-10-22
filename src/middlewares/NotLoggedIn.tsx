import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../app/store";

interface Props {
  children: ReactNode;
}

function LoggedInProtectedRoutes({ children }: Props) {
  const jwtToken = useSelector(
    (state: RootState) => state.userDetails.jwtToken
  );

  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default LoggedInProtectedRoutes;
