import { CPagination } from "@coreui/react";
import React, { useState } from "react";
import BaseTable from "src/components/BaseTable";
import { scopedSlots } from "src/service/topicService";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "guideTeacherNames", label: "GVHD" },
  { key: "reviewTeacherNames", label: "GVPB" },
];

const MainComponent = ({ onRowClick, topics = [] }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const calPage = () => {
    const a = Math.floor(topics.length / itemsPerPage);
    const b = topics.length % itemsPerPage === 0 ? 0 : 1;
    return a + b;
  };

  return (
    <>
      <BaseTable
        items={topics}
        fields={fields}
        scopedSlots={scopedSlots}
        pagination={false}
        tableProps={{
          tableFilter: false,
          itemsPerPageSelect: false,
          activePage: page,
          clickableRows: true,
          onRowClick: onRowClick,
        }}
      />
      <CPagination
        size="sm"
        align="center"
        activePage={page}
        onActivePageChange={setPage}
        pages={calPage()}
      />
    </>
  );
};

export default MainComponent;
