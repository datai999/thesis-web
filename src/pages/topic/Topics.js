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
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserIsStudent } from "src/service/permissionService";
import TopicTable from "./TopicTable";

const MainComponent = () => {
  const history = useHistory();
  const isThesisTab = window.location.pathname.match("/topics/thesis")
    ? true
    : false;

  const [studentDoneOutline, setStudentDoneOutline] = React.useState(true);

  React.useEffect(() => {
    if (loginUserIsStudent())
      api
        .get(`/students/${context.user.id}/done-outline`)
        .then(setStudentDoneOutline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={isThesisTab ? 1 : 0}
          onActiveTabChange={(index) =>
            history.push(
              `/topics/${index === 1 ? "thesis" : "outline"}/${
                context.semester.name
              }`
            )
          }
        >
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink>Đề cương</CNavLink>
            </CNavItem>
            {studentDoneOutline && (
              <CNavItem>
                <CNavLink>Luận văn</CNavLink>
              </CNavItem>
            )}
          </CNav>

          <CTabContent>
            <CTabPane>
              {!isThesisTab && <TopicTable thesis={isThesisTab} />}
            </CTabPane>
            {studentDoneOutline && (
              <CTabPane>
                {isThesisTab && <TopicTable thesis={isThesisTab} />}
              </CTabPane>
            )}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
