import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import TemplateSearchModal from "./TemplateSearchModal";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "name", label: "Tên mẫu" },
  { key: "type", label: "Loại đề tài" },
  { key: "numberMark", label: "Thang điểm số" },
  { key: "majorNames", label: "Chuyên ngành" },
  { key: "teacherRoles", label: "Người chấm điểm" },
];

const MainComponent = () => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/").pop();
  const isCurrentSemester = context.semester?.name === semesterName;

  const [data, setData] = useState([]);
  const [searchTemplate, setSearchTemplate] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const recursiveRemoveId = (criterion) => {
    if (!criterion) return;
    criterion.id = null;
    criterion.children?.forEach(recursiveRemoveId);
  };

  const copy = (template) => {
    setWaiting(true);
    const nextTemplate = {
      ...template,
      id: null,
      semester: { id: context.semester?.id },
    };
    recursiveRemoveId(nextTemplate.rootCriterion);
    api.post(`/templates`, nextTemplate).then(() => {
      setWaiting(false);
      setRefresh(!refresh);
    });
  };

  React.useEffect(() => {
    api
      .post(
        `/templates/example`,
        { semester: { name: semesterName } },
        { params: { direction: "ASC" } }
      )
      .then(setData);
  }, [semesterName, refresh]);

  if (waiting) throw new Promise(() => {});

  return (
    <CCard>
      <TemplateSearchModal
        view={searchTemplate}
        disableView={() => setSearchTemplate(false)}
        selected={copy}
      />

      <CCardHeader>
        <CRow>
          <CCol>
            <h5>
              <strong>Mẫu tiêu chí sử dụng</strong>
            </h5>
          </CCol>
          {isCurrentSemester && (
            <>
              <CCol md="0">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => {
                    setSearchTemplate(true);
                  }}
                >
                  Sao chép mẫu
                </CButton>
              </CCol>
              <CCol md="0" className="ml-2">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => {
                    history.push(`${window.location.pathname}/create`);
                  }}
                >
                  Soạn mẫu mới
                </CButton>
              </CCol>
            </>
          )}
        </CRow>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          items={data}
          fields={fields}
          selectSemester={true}
          tableProps={{
            striped: true,
            clickableRows: true,
            itemsPerPage: 10,
            onRowClick: (item) =>
              history.push(`${window.location.pathname}/${item.id}`, item),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
