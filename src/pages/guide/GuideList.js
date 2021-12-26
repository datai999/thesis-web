import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserIsTeacher } from "src/service/permissionService";
import { fields, scopedSlots } from "src/service/topicService";

const guideFields = fields.filter(
  (e) => !["subjectDepartmentName", "studentCount"].includes(e.key)
);

const renderColorState = (state) => {
  switch (state) {
    case "REGISTER":
      return "warning";
    case "MID":
      return "info";
    case "FINAL":
      return "primary";
    case "COMPLETE":
      return "success";
    default:
      return "";
  }
};

const MainComponent = () => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);
  const [canCreate, setCanCreate] = useState(false);

  const getData = async () => {
    api
      .get(`/guide-teachers/${context.user.id}/topics`, {
        params: {
          semesterName,
        },
      })
      .then(setData);
    api.get(`/semesters/in-any-create-time`).then(setCanCreate);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>
            <h4>Danh sách đề tài hướng dẫn</h4>
          </CCol>
          {loginUserIsTeacher() &&
            semesterName === context.semester.name &&
            canCreate && (
              <CCol md="2">
                <CButton
                  color="primary"
                  className="float-right"
                  onClick={() => history.push(`/guide/${semesterName}/create`)}
                >
                  Tạo đề tài
                </CButton>
              </CCol>
            )}
        </CRow>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          fields={[...guideFields, { key: "stateName", label: "Trạng thái" }]}
          items={data}
          scopedSlots={{
            ...scopedSlots,
            stateName: (item) => (
              <td>
                <CBadge color={renderColorState(item.state)}>
                  {item.stateName}
                </CBadge>
              </td>
            ),
          }}
          selectSemester
          semesterTop={8}
          tableProps={{
            clickableRows: true,
            onRowClick: (item) =>
              history.push(`/guide/${semesterName}/${item.id}`),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
