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
import TopicTable from "./TopicTable";

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const isThesisTab = location.pathname === "/topics/thesis";
  const [activeThesisTab, setActiveThesisTab] = useState(isThesisTab);

  useEffect(() => {
    history.push(`/topics/${activeThesisTab ? "thesis" : "outline"}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThesisTab, activeThesisTab]);

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={activeThesisTab ? 1 : 0}
          onActiveTabChange={(index) => setActiveThesisTab(index === 1)}
        >
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink>Đề cương</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink>Luận văn</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane>{!isThesisTab && <TopicTable thesis={false} />}</CTabPane>
            <CTabPane>{isThesisTab && <TopicTable thesis={true} />}</CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
