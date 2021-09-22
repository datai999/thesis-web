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
import contextService from "src/service/contextService";
import TopicExecute from "./TopicExecutes";
import TopicGuides from "./TopicGuides";
import TopicReviews from "./TopicReviews";

const tabs = [
  {
    url: "execute",
    roles: ["ADMIN", "STUDENT"],
    tabName: "Thực thi",
    component: <TopicExecute />,
  },
  {
    url: "guide",
    roles: ["ADMIN", "TEACHER"],
    tabName: "Hướng dẫn",
    component: <TopicGuides />,
  },
  {
    url: "review",
    roles: ["ADMIN", "TEACHER"],
    tabName: "Phản biện",
    component: <TopicReviews />,
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
  const [tabIndex, setTabIndex] = useState(tab < 0 ? 0 : tab);

  useEffect(() => {
    history.push(`/my/topics/${roleTabs[tabIndex].url}`);
  }, [tabIndex]);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
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
                  size="sm"
                  className="float-right"
                  onClick={() => history.push(`/my/topics/create`)}
                  className="float-right r-0"
                >
                  Thêm đề tài
                </CButton>
              </CCol>
            )}
          </CRow>
          <CTabContent>
            {roleTabs.map((e) => (
              <CTabPane key={e.url}>
                <CNavLink>{e.component}</CNavLink>
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
