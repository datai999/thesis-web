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
  CTabs,
} from "@coreui/react";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";
import SettingTemplate from "./SettingTemplate";
import TemplateTable from "./TemplateTable";

const tabs = [
  {
    url: "/list",
    tabName: "Danh sách mẫu tiêu chí",
    component: <TemplateTable />,
  },
  {
    url: "/setting",
    tabName: "Cài đặt mẫu tiêu chí",
    component: <SettingTemplate />,
  },
];

const MainComponent = () => {
  const history = useHistory();
  const lastPath = useLocation().pathname.split("/").pop();
  const tabIndex = ["templates", "list"].includes(lastPath) ? 0 : 1;

  const canCreate = loginUserHasAny([PERMISSIONS.EDUCATION_STAFF]);

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={tabIndex}
          onActiveTabChange={(nextTab) =>
            history.push(
              `/templates${
                !canCreate && nextTab === 0 ? "/setting" : tabs[nextTab].url
              }`
            )
          }
        >
          {canCreate && (
            <CRow>
              <CCol>
                <CNav variant="tabs">
                  {tabs.map((e) => (
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
          )}
          <CTabContent>
            {tabs.map((tab, index) => (
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
