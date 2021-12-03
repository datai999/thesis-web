import { CSpinner, CToaster } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import "./scss/style.scss";
import { initContext } from "./service/contextService";
import toastHolder from "./service/toastService";

const loading = (
  <div
    class="d-flex justify-content-center align-items-center"
    style={{ marginTop: "20%" }}
  >
    <CSpinner />
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
  const history = useHistory();

  const [toasts, addToasts] = useState([]);
  const [waitingInit, setWaitingInit] = useState(false);

  const init = async () => {
    setWaitingInit(true);
    const token = await initContext();
    setWaitingInit(false);
    if (!token) {
      history.go(`/login`);
    }
  };

  useEffect(() => {
    // init();
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
            {!waitingInit && (
              <Route
                path="/"
                name="Home"
                render={(props) => <TheLayout {...props} />}
              />
            )}
          </Switch>
        </React.Suspense>
      </BrowserRouter>
      {/* {sleep && (
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
      )} */}
    </>
  );
};

export default App;
