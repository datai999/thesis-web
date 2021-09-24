import { CToaster } from "@coreui/react";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import { initContext } from "./service/contextService";
import { toastHolder } from "./service/toastService";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const [toasts, addToasts] = useState([]);
  const [sleep, setSleep] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      const init = await initContext();
      setTimeout(() => {
        setSleep(!init);
      }, 100);
    };
    init();
  }, []);

  useEffect(() => {
    toastHolder.toast = (toast) => addToasts([...toasts, toast]);
  }, [toasts]);

  return (
    <>
      <CToaster position="top-center">
        {toasts.map((toast, index) => (
          <div key={index}>{toast}</div>
        ))}
      </CToaster>
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={(props) => <TheLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
      {sleep && (
        <LoadingOverlay
          active={true}
          spinner
          styles={{
            overlay: (base) => ({
              ...base,
              position: "fixed",
              zIndex: "10000",
            }),
          }}
        />
      )}
    </>
  );
};

export default App;
