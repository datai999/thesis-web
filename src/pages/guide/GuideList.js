import {
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

const guideFields = fields.filter((e) => e.key !== "subjectDepartmentName");

const MainComponent = () => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);

  const getData = async () => {
    api
      .get(`/guide-teachers/${context.user.id}/topics`, {
        params: {
          semesterName,
        },
      })
      .then(setData);
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
          {loginUserIsTeacher() && semesterName === context.semester.name && (
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
          fields={guideFields}
          items={data}
          scopedSlots={scopedSlots}
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