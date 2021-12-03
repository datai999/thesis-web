import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import { PERMISSIONS } from "src/service/permissionService";

const fields = [
  { key: "code", label: "Mã số" },
  { key: "firstName", label: "Họ" },
  { key: "lastName", label: "Tên" },
  { key: "degreeName", label: "Học vị" },
  { key: "email", label: "Email:@hcmut.edu.vn" },
];

const Component = ({ view, disableView, selected, userNotShow = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .post(
        "/users/example",
        {
          permission: PERMISSIONS.TEACHER,
          subjectDepartment: context.user?.subjectDepartment?.id,
        },
        { params: { direction: "DESC" } }
      )
      .then((res) => {
        const dataFilter = res.filter(
          (e) => !userNotShow.some((user) => user.id === e.id)
        );
        setData(dataFilter);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          Tìm kiếm giáo viên {context.user?.subjectDepartment?.name}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <BaseTable
          fields={fields}
          items={data}
          tableProps={{
            clickableRows: true,
            onRowClick: selected,
          }}
        />
      </CModalBody>
    </CModal>
  );
};

export default Component;
