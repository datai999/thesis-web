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
import context from "src/service/contextService";
import { loginUserIsHead } from "src/service/permissionService";

const tabs = context.subjectDepartments.map((e) => {
  return {
    id: e.id,
    tabName: e.name,
  };
});

const MainComponent = ({ URL, InnerComponent }) => {
  const history = useHistory();
  const headSubjectDepartment = loginUserIsHead();

  const pushTabIndex = (index) => {
    history.push(`${URL}/${tabs[index].id}/${context.semester.name}`);
  };

  React.useEffect(() => {
    history.push(
      `${URL}/${
        headSubjectDepartment ? context.user.subjectDepartment?.id : tabs[0].id
      }/${context.semester.name}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardBody>
        {headSubjectDepartment ? (
          <InnerComponent
            subjectDepartmentId={context.user.subjectDepartment?.id}
          />
        ) : (
          <CTabs activeTab={0} onActiveTabChange={pushTabIndex}>
            <CNav variant="tabs">
              {tabs.map((e) => (
                <CNavItem key={e.id}>
                  <CNavLink>{e.tabName}</CNavLink>
                </CNavItem>
              ))}
            </CNav>
            <CTabContent>
              {tabs.map((tab) => (
                <CTabPane>
                  <InnerComponent subjectDepartmentId={tab.id} />
                </CTabPane>
              ))}
            </CTabContent>
          </CTabs>
        )}
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
