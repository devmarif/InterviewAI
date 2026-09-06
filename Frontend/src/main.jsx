import { createRoot } from "react-dom/client";
import "./index.css";
import { ContextProvider } from "./features/Contexts/AuthContext.jsx";
import AppRoutes from "./Routes/AppRoutes.jsx";
import { InterviewContextProvider } from "../src/features/Contexts/InterviewContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <InterviewContextProvider>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </InterviewContextProvider>
  </ContextProvider>,
);
