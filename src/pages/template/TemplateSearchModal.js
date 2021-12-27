import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import TemplateDetail from "./TemplateDetail";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "semesterName", label: "Học kỳ", _style: { width: 100 } },
  { key: "name", label: "Tên mẫu" },
  { key: "type", label: "Loại đề tài" },
  { key: "numberMark", label: "Thang điểm số" },
  { key: "majorNames", label: "Chuyên ngành" },
  { key: "teacherRoles", label: "Người chấm điểm" },
];

const MainComponent = ({ view, disableView, selected }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewTemplate, setViewTemplate] = useState(false);
  const [template, setTemplate] = useState({});

  const calPage = () => {
    const a = Math.floor(data.length / itemsPerPage);
    const b = data.length % 5 === 0 ? 0 : 1;
    return a + b;
  };

  const viewTemplateDetail = (item) => {
    setTemplate(item);
    setViewTemplate(true);
  };

  useEffect(() => {
    api
      .get(`/templates/not-is-semester`, {
        params: { direction: "DESC", semesterId: context.semester?.id },
      })
      .then((res) => {
        setData(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <TemplateModal
        view={viewTemplate}
        disableView={() => setViewTemplate(false)}
        template={template}
        confirm={() => {
          disableView();
          selected(template);
        }}
      />
      <CModalHeader closeButton>
        <CModalTitle>Danh sách mẫu tiêu chí ở học kỳ đã qua</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <BaseTable
          fields={fields}
          items={data}
          pagination={false}
          tableProps={{
            clickableRows: true,
            onRowClick: viewTemplateDetail,
            activePage: page < 1 ? 1 : page,
            itemsPerPage: itemsPerPage,
            onPaginationChange: (e) => setItemsPerPage(e),
          }}
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

const TemplateModal = ({ view, disableView, template, confirm }) => {
  if (!template || Object.keys(template).length < 1) return <></>;

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>{`Sao chép  mẫu tiêu chí`}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <TemplateDetail location={{ state: template }} />
      </CModalBody>
      <CModalFooter>
        <CButton type="submit" color="primary" onClick={confirm}>
          Sao chép mẫu tiêu chí này
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
