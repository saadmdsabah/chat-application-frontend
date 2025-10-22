import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import ReactRouter from "./config/ReactRouter.jsx";
import { Toaster } from "react-hot-toast";
import { persistor } from "./app/store.js";
import store from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import { connectClient } from "./services/websocketClient.js";

const router = ReactRouter();

connectClient();
const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      <Toaster />
    </PersistGate>
  </Provider>
);
