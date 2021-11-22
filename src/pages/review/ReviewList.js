import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import { fields, scopedSlots } from "src/service/topicService";

const reviewFields = fields.filter((e) => e.key !== "subjectDepartmentName");

const MainComponent = () => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);

  const getData = async () => {
    api
      .get(`/review-teachers/${context.user.id}/topics`, {
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
        <h4>Danh sách đề tài phản biện</h4>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          fields={reviewFields}
          items={data}
          scopedSlots={scopedSlots}
          selectSemester
          semesterTop={8}
          tableProps={{
            clickableRows: true,
            onRowClick: (item) =>
              history.push(`/review/${semesterName}/${item.id}`),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
