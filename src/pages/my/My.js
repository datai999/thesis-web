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
import context from "src/service/contextService";
import { loginUserIsTeacher } from "src/service/permissionService";
import MyCouncil from "./MyCouncil";
import TopicGuides from "./TopicGuides";
import TopicReviews from "./TopicReviews";

const tabs = [
  {
    url: "guide",
    tabName: "Hướng dẫn",
    component: TopicGuides,
  },
  {
    url: "review",
    tabName: "Phản biện",
    component: TopicReviews,
  },
  {
    url: "council",
    tabName: "Hội đồng",
    component: MyCouncil,
  },
];

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const tab = tabs.map((e) => e.url).indexOf(location.pathname.split("/")[3]);
  const tabIndex = tab < 0 ? 0 : tab;

  const pushTabIndex = (nextTab) => {
    history.push(`/my/topics/${tabs[nextTab]?.url}/${context.semester.name}`);
  };

  if (tab < 0) pushTabIndex(0);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={pushTabIndex}>
          <CRow>
            <CCol>
              <CNav variant="tabs">
                {tabs.map((e) => (
                  <CNavItem key={e.url}>
                    <CNavLink>{e.tabName}</CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCol>
            {loginUserIsTeacher() && tabIndex === 0 && (
              <CCol md="2">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => history.push(`/my/topics/create`)}
                >
                  Tạo đề tài
                </CButton>
              </CCol>
            )}
          </CRow>
          <CTabContent>
            {tabs.map((e, index) => (
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
