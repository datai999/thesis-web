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
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import TopicTable from "./TopicTable";

const MainComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const isThesisTab = location.pathname == "/topics/thesis";
  const [activeThesisTab, setActiveThesisTab] = useState(isThesisTab);

  useEffect(() => {
    activeThesisTab !== activeThesisTab && setActiveThesisTab(activeThesisTab);
    history.push(`/topics/${activeThesisTab ? "thesis" : "outline"}`);
  }, [isThesisTab, activeThesisTab]);

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={activeThesisTab ? 1 : 0}
          onActiveTabChange={(index) => setActiveThesisTab(index == 1)}
        >
          <CRow>
            <CCol>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>Đề cương</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>Luận văn</CNavLink>
                </CNavItem>
              </CNav>
            </CCol>
            <CCol md="2">
              <CButton
                color="primary"
                className="float-right"
                onClick={() => history.push(`/topics/create`)}
              >
                Thêm đề tài
              </CButton>
            </CCol>
          </CRow>
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
