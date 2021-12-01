import { CContainer, CFade, CSpinner } from "@coreui/react";
import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserModal, userModalHolder } from "src/components/user/UserModal";
// routes config
import routes from "../routes";

const loading = (
  <div
    class="d-flex justify-content-center align-items-center"
    style={{ marginTop: "20%" }}
  >
    <CSpinner />
  </div>
);

const TheContent = () => {
  const [viewUser, setViewUser] = React.useState(false);
  const [userProps, setUserProps] = React.useState({});

  React.useEffect(() => {
    userModalHolder.handler = (user) => {
      setUserProps({ userId: user.id });
      setViewUser(true);
    };
  }, []);

  return (
    <main className="c-main">
      <UserModal
        view={viewUser}
        disableView={() => setViewUser(false)}
        {...userProps}
      />
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            <Redirect from="/" to="/login" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
