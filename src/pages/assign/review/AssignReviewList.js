import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import { fields, scopedSlots } from "src/service/topicService";
import AssignReviewModal from "./AssignReviewModal";

const assignReviewFields = [
  ...fields.filter(
    (e) => !["subjectDepartmentName", "studentCount"].includes(e.key)
  ),
  {
    key: "reviewTeachers",
    label: "Giáo viên phản biện",
  },
];

const MainComponent = ({ subjectDepartmentId = 1 }) => {
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);
  const [assignReview, setAssignReview] = useState(false);
  const [assignReviewProps, setAssignReviewProps] = useState({ topic: {} });

  const getData = () => {
    api
      .get(`/review-teachers/${subjectDepartmentId}/topic-review`, {
        params: { semesterName },
      })
      .then((response) => {
        setData(response);
      });
  };

  useEffect(() => {
    semesterName !== "assign-review" && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

  return (
    <CCard>
      <AssignReviewModal
        view={assignReview}
        disableView={() => setAssignReview(false)}
        confirm={getData}
        {...assignReviewProps}
      />
      <CCardHeader>
        <h4>Danh sách đề tài cần phân công phản biện</h4>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          fields={assignReviewFields}
          items={data}
          selectSemester
          semesterTop={8}
          tableProps={{
            clickableRows: true,
            onRowClick: (item) => {
              setAssignReviewProps({ topic: item });
              setAssignReview(true);
            },
          }}
          scopedSlots={scopedSlots}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
