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
import contextService from "src/service/contextService";
import AssignReviewTable from "./AssignReviewTable";

const tabs = contextService.subjectDepartments.map((e) => {
  return {
    id: e.id,
    roles: ["ADMIN", "TEACHER"],
    tabName: e.name,
  };
});

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const roleTabs = tabs.filter((e) =>
    e.roles.some((role) => contextService.user.roles.includes(role))
  );
  const tab = roleTabs
    .map((e) => e.id.toString())
    .indexOf(location.pathname.split("/").pop());
  const [tabIndex, setTabIndex] = useState(tab < 0 ? 0 : tab);

  useEffect(() => {
    history.push(`/assign/review/${roleTabs[tabIndex].id}`);
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
            <CTabPane>
              <CNavLink>
                <AssignReviewTable
                  subjectDepartmentId={roleTabs[tabIndex].id}
                />
              </CNavLink>
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
