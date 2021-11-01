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
import React from "react";
import { useHistory } from "react-router-dom";
import TopicTable from "./TopicTable";

const MainComponent = () => {
  const history = useHistory();
  const isThesisTab = window.location.pathname === "/topics/thesis";

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={isThesisTab ? 1 : 0}
          onActiveTabChange={(index) =>
            history.push(`/topics/${index === 1 ? "thesis" : "outline"}`)
          }
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
            <CTabPane>
              {!isThesisTab && <TopicTable thesis={isThesisTab} />}
            </CTabPane>
            <CTabPane>
              {isThesisTab && <TopicTable thesis={isThesisTab} />}
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
