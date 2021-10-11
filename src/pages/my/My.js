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
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import contextService from "src/service/contextService";
import MyCouncil from "./MyCouncil";
import TopicExecute from "./TopicExecutes";
import TopicGuides from "./TopicGuides";
import TopicReviews from "./TopicReviews";

const tabs = [
  {
    url: "execute",
    roles: ["ADMIN", "STUDENT"],
    tabName: "Thực thi",
    component: TopicExecute,
  },
  {
    url: "guide",
    roles: ["ADMIN", "TEACHER"],
    tabName: "Hướng dẫn",
    component: TopicGuides,
  },
  {
    url: "review",
    roles: ["ADMIN", "TEACHER"],
    tabName: "Phản biện",
    component: TopicReviews,
  },
  {
    url: "council",
    roles: ["ADMIN", "TEACHER"],
    tabName: "Hội đồng",
    component: MyCouncil,
  },
];

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const roleTabs = tabs.filter((e) =>
    e.roles.some((role) => contextService.user.roles.includes(role))
  );
  const tab = roleTabs
    .map((e) => e.url)
    .indexOf(location.pathname.split("/").pop());
  const tabIndex = tab < 0 ? 0 : tab;

  const pushTabIndex = (nextTab) => {
    history.push(`/my/topics/${roleTabs[nextTab].url}`);
  };

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={pushTabIndex}>
          <CRow>
            <CCol>
              <CNav variant="tabs">
                {roleTabs.map((e) => (
                  <CNavItem key={e.url}>
                    <CNavLink>{e.tabName}</CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCol>
            {["ADMIN", "TEACHER"].some((role) =>
              contextService.user.roles.includes(role)
            ) && (
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
            {roleTabs.map((e, index) => (
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
