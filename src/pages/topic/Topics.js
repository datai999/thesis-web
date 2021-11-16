import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CSelect,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";
import TopicTable from "./TopicTable";

const MainComponent = () => {
  const history = useHistory();
  const isThesisTab = window.location.pathname === "/topics/thesis";

  const [semesters, setSemesters] = React.useState([]);
  const [querySemester, setQuerySemester] = React.useState(context.semester);

  const onChangeSemester = (event) => {
    let nextSemester = semesters.find(
      (semester) => semester.id.toString() === event.currentTarget.value
    );
    setQuerySemester(nextSemester);
  };

  React.useEffect(() => {
    api.post(`/semesters/example`, { status: "USED" }).then((res) => {
      res.push(context.semester);
      setSemesters(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    history.push(
      `/topics/${isThesisTab ? "thesis" : "outline"}/${querySemester.name}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySemester]);

  return (
    <CCard>
      <CCardBody>
        <CTabs
          activeTab={isThesisTab ? 1 : 0}
          onActiveTabChange={(index) =>
            history.push(`/topics/${index === 1 ? "thesis" : "outline"}`)
          }
        >
          <div class="d-flex justify-content-between">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>Đề cương</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>Luận văn</CNavLink>
              </CNavItem>
            </CNav>
            <tr>
              <td style={{ paddingRight: 10 }}>Học kỳ</td>
              <td>
                <CSelect onChange={onChangeSemester}>
                  {semesters.map((e) => (
                    <option
                      id={e.id}
                      value={e.id}
                      selected={
                        e.id.toString() === querySemester.id?.toString()
                      }
                    >
                      {e.name}
                    </option>
                  ))}
                </CSelect>
              </td>
            </tr>
          </div>

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
