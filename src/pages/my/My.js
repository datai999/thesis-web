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
  loginUserIsTeacher,
  permissionFilter,
  PERMISSIONS,
} from "src/service/permissionService";
import MyCouncil from "./MyCouncil";
import TopicExecute from "./TopicExecutes";
import TopicGuides from "./TopicGuides";
import TopicReviews from "./TopicReviews";

const tabs = [
  {
    url: "execute",
    permissions: [PERMISSIONS.STUDENT],
    tabName: "Thực thi",
    component: TopicExecute,
  },
  {
    url: "guide",
    permissions: [PERMISSIONS.TEACHER, PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
    tabName: "Hướng dẫn",
    component: TopicGuides,
  },
  {
    url: "review",
    permissions: [PERMISSIONS.TEACHER, PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
    tabName: "Phản biện",
    component: TopicReviews,
  },
  {
    url: "council",
    permissions: [PERMISSIONS.TEACHER, PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
    tabName: "Hội đồng",
    component: MyCouncil,
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
    history.push(`/my/topics/${permissionTabs[nextTab]?.url}`);
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
            {loginUserIsTeacher() && (
              <CCol md="2">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => history.push(`/my/topics/create`)}
                >
                  Thêm đề tài
                </CButton>
              </CCol>
            )}
          </CRow>
          <CTabContent>
            {permissionTabs.map((e, index) => (
              <CTabPane key={e.url}>
                {index === tabIndex && <e.component />}
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
