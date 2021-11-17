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
import {
  loginUserHasAny,
  permissionFilter,
  PERMISSIONS,
} from "src/service/permissionService";
import UserList from "./UserList";

const tabs = [
  {
    url: "student",
    tabName: "Sinh viên",
  },
  {
    url: "teacher",
    tabName: "Giáo viên",
  },
  {
    url: "head",
    tabName: "Trưởng phòng ban",
  },
  {
    url: "edu-staff",
    tabName: "Giáo vụ",
  },
  {
    url: "admin",
    permissions: [PERMISSIONS.ADMIN],
    tabName: "Admin",
  },
];

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const permissionTabs = tabs.filter(permissionFilter);
  const tab = permissionTabs
    .map((e) => e.url)
    .indexOf(location.pathname.split("/").pop());

  const tabIndex = tab < 0 ? 0 : tab;

  const pushTabIndex = (nextTab) => {
    history.push(`/users/${permissionTabs[nextTab].url}`);
  };

  if (tab < 0) pushTabIndex(0);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={pushTabIndex}>
          <CRow>
            <CCol>
              <CNav variant="tabs">
                {permissionTabs.map((e) => (
                  <CNavItem key={e.url}>
                    <CNavLink>{e.tabName}</CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCol>
            {loginUserHasAny([
              PERMISSIONS.ADMIN,
              PERMISSIONS.EDUCATION_STAFF,
            ]) && (
              <CCol md="2">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => history.push(`/my/topics/create`)}
                >
                  Thêm {tabs[tabIndex].tabName}
                </CButton>
              </CCol>
            )}
          </CRow>
          <CTabContent>
            {permissionTabs.map((e, index) => (
              <CTabPane key={e.url}>
                {index === tabIndex && <UserList />}
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
