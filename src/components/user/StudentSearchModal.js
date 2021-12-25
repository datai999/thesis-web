import {
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";

const fields = [
  { key: "code", label: "Mã số" },
  { key: "firstName", label: "Họ" },
  { key: "lastName", label: "Tên" },
  { key: "email", label: "Email" },
];

const Component = ({
  view,
  disableView,
  selected,
  userNotShow = [],
  ...props
}) => {
  const queryProps = {
    thesis: props.thesis,
    educationMethodIds: props.educationMethods?.map((e) => e ?? e?.id),
    majorIds: props.majors?.map((e) => e ?? e?.id),
  };

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const calPage = () => {
    const a = Math.floor(data.length / itemsPerPage);
    const b = data.length % 5 === 0 ? 0 : 1;
    return a + b;
  };

  useEffect(() => {
    api.post("/students/assign-topic", queryProps).then((res) => {
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
        <CModalTitle>Tìm kiếm sinh viên</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol md="0" className="ml-3">
            <strong>Đăng ký: </strong>
            {queryProps.thesis ? "Luận văn" : "Đề cương"}
          </CCol>
          <CCol md="0" className="ml-3">
            <div>
              <strong>Đào tạo: </strong>
              {queryProps.educationMethodIds
                ?.map(
                  (id) => context.educationMethods.find((e) => e.id === id).name
                )
                ?.join(", ")}
            </div>
          </CCol>
          <CCol md="0" className="ml-3">
            <div>
              <strong>Chuyên ngành: </strong>
              {queryProps.majorIds
                ?.map((id) => context.majors.find((e) => e.id === id).name)
                ?.join(", ")}
            </div>
          </CCol>
        </CRow>
        <BaseTable
          fields={fields}
          items={data}
          tableProps={{
            clickableRows: true,
            onRowClick: selected,
            activePage: page < 1 ? 1 : page,
            itemsPerPage: itemsPerPage,
            onPaginationChange: (e) => setItemsPerPage(e),
          }}
          pagination={false}
        />
        <CPagination
          size="sm"
          align="center"
          activePage={page < 1 ? 1 : page}
          onActivePageChange={setPage}
          pages={calPage()}
        />
      </CModalBody>
    </CModal>
  );
};

export default Component;
