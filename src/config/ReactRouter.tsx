import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import App from "../App";
import ChatPage from "../component/ChatPage";
import Login from "../component/Login";
import Register from "../component/Register";
import LoggedInProtectedRoutes from "../middlewares/NotLoggedIn";
import AlreadyLoggedInProtection from "../middlewares/LoggedIn";
import CreateRoom from "../component/CreateRoom";
import JoinRoom from "../component/JoinRoom";
import SentInvitations from "../component/SentInvitations";
import ReceivedInvitations from "../component/ReceivedInvitations";

function ReactRouter() {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="login"
          element={
            <AlreadyLoggedInProtection>
              <Login />
            </AlreadyLoggedInProtection>
          }
        />
        <Route
          path="register"
          element={
            <AlreadyLoggedInProtection>
              <Register />
            </AlreadyLoggedInProtection>
          }
        />
        <Route
          path="join"
          element={
            <LoggedInProtectedRoutes>
              <JoinRoom />
            </LoggedInProtectedRoutes>
          }
        />
        <Route
          path="create"
          element={
            <LoggedInProtectedRoutes>
              <CreateRoom />
            </LoggedInProtectedRoutes>
          }
        />

        <Route
          path="sentInvitations"
          element={
            <LoggedInProtectedRoutes>
              <SentInvitations />
            </LoggedInProtectedRoutes>
          }
        />

        <Route
          path="receivedInvitations"
          element={
            <LoggedInProtectedRoutes>
              <ReceivedInvitations />
            </LoggedInProtectedRoutes>
          }
        />

        <Route
          index
          element={
            <LoggedInProtectedRoutes>
              <App />
            </LoggedInProtectedRoutes>
          }
        />
        <Route
          path="chat"
          element={
            <LoggedInProtectedRoutes>
              <ChatPage />
            </LoggedInProtectedRoutes>
          }
        />
      </Route>
    )
  );
}

export default ReactRouter;
