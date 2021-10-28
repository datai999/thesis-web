import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import contextHolder from "src/service/contextService";
import { PERMISSIONS } from "./../service/permissionService";

const tabs = contextHolder.subjectDepartments.map((e) => {
  return {
    id: e.id,
    tabName: e.name,
  };
});

const MainComponent = ({ URL, InnerComponent }) => {
  const history = useHistory();
  const location = useLocation();
  const headSubjectDepartment = contextHolder.user.permissions.includes(
    PERMISSIONS.HEAD_SUBJECT_DEPARTMENT
  );

  const subjectDepartmentId = !headSubjectDepartment
    ? location.pathname.split("/").pop()
    : contextHolder.user.subjectDepartment?.id;
  const initTabIndex = tabs.findIndex(
    (e) => e.id.toString() === subjectDepartmentId?.toString()
  );

  const [tabIndex, setTabIndex] = useState(initTabIndex < 0 ? 0 : initTabIndex);

  useEffect(() => {
    if (headSubjectDepartment) {
      history.push(`${URL}/${contextHolder.user.subjectDepartment.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    history.push(`${URL}/${tabs[tabIndex].id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
          <CNav variant="tabs">
            {tabs.map((e) => (
              <CNavItem key={e.id}>
                <CNavLink>{e.tabName}</CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <CTabContent>
            {tabs.map((tab, index) => (
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
