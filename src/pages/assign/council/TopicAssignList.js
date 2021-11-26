import { CPagination } from "@coreui/react";
import React, { useState } from "react";
import BaseTable from "src/components/BaseTable";
import { scopedSlots } from "src/service/topicService";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "guideTeachers", label: "GVHD" },
  { key: "reviewTeachers", label: "GVPB" },
];

const MainComponent = ({ onRowClick, topics = [] }) => {
  const [page, setPage] = useState(1);

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
      />
    </>
  );
};

export default MainComponent;