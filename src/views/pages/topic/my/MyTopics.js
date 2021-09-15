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
import MyTopicExecute from "./TopicExecutes";
import MyTopicGuides from "./TopicGuides";

const tabs = ["execute", "guide", "review"];

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const tab = tabs.indexOf(location.pathname.split("/").pop());
  const [tabIndex, setTabIndex] = useState(tab < 0 ? 0 : tab);

  useEffect(() => {
    history.push(`/my/topics/${tabs[tabIndex]}`);
  }, [tabIndex]);

  return (
    <CCard>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink>Thực thi</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>Hướng dẫn</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>Phản biện</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane>{tabIndex === 0 && <MyTopicExecute />}</CTabPane>
            <CTabPane>{tabIndex === 1 && <MyTopicGuides />}</CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
