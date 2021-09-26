import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import contextHolder from "src/service/contextService";

const tabs = contextHolder.subjectDepartments.map((e) => {
  return {
    id: e.id,
    roles: ["ADMIN", "TEACHER"],
    tabName: e.name,
  };
});

const MainComponent = ({ URL, InnerComponent }) => {
  const history = useHistory();
  const location = useLocation();
  const roleTabs = tabs.filter((e) =>
    e.roles.some((role) => contextHolder.user.roles.includes(role))
  );
  const tab = roleTabs
    .map((e) => e.id.toString())
    .indexOf(location.pathname.split("/").pop());
  const [tabIndex, setTabIndex] = useState(tab < 0 ? 0 : tab);

  useEffect(() => {
    history.push(`${URL}/${roleTabs[tabIndex].id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
          <CNav variant="tabs">
            {roleTabs.map((e) => (
              <CNavItem key={e.id}>
                <CNavLink>{e.tabName}</CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <CTabContent>
            {roleTabs.map((tab, index) => (
              <CTabPane>
                {index === tabIndex && (
                  <InnerComponent subjectDepartmentId={tab.id} />
                )}
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
