import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import contextHolder from "src/service/contextService";
import SettingTemplate from "./SettingTemplate";
import TemplateTable from "./TemplateTable";

const tabs = [
  {
    url: "/list",
    roles: ["ADMIN", "STAFF"],
    tabName: "Danh sách mẫu tiêu chí",
    component: <TemplateTable />,
  },
  {
    url: "/setting",
    roles: ["ADMIN", "STAFF"],
    tabName: "Cài đặt mẫu tiêu chí",
    component: <SettingTemplate />,
  },
];

const MainComponent = () => {
  const history = useHistory();
  const lastPath = useLocation().pathname.split("/").pop();
  const roleTabs = tabs.filter((e) =>
    e.roles.some((role) => contextHolder.user.roles.includes(role))
  );
  const [tabIndex, setTabIndex] = useState(
    ["templates", "list"].includes(lastPath) ? 0 : 1
  );

  useEffect(() => {
    history.push(`/templates${roleTabs[tabIndex].url}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
          <CRow>
            <CCol>
              <CNav variant="tabs">
                {roleTabs.map((e) => (
                  <CNavItem key={e.tabName}>
                    <CNavLink>{e.tabName}</CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-right"
                onClick={() => {
                  history.push(`/templates/create`);
                }}
              >
                Thêm mẫu mới
              </CButton>
            </CCol>
          </CRow>
          <CTabContent>
            {roleTabs.map((tab, index) => (
              <CTabPane key={index}>
                {index === tabIndex && tab.component}
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
