import CIcon from "@coreui/icons-react";
import { CDataTable, CPagination, CTooltip } from "@coreui/react";
import React, { useState } from "react";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  {
    key: "educationMethodNames",
    label: "Phương thức",
  },
  { key: "majorNames", label: "Ngành" },
  { key: "guideTeacherRenders", label: "Giáo viên hướng dẫn" },
];

const MainComponent = ({ onRowClick, topics = [] }) => {
  const [page, setPage] = useState(1);

  return (
    <>
      <CDataTable
        items={topics}
        fields={fields}
        activePage={page}
        itemsPerPage={20}
        size="sm"
        striped
        columnFilter
        sorter
        hover
        clickableRows
        onRowClick={onRowClick}
        scopedSlots={{
          guideTeacherRenders: (item) => (
            <td>
              {item.guideTeachers.map((user) => (
                <div>
                  {user.code} {user.firstName} {user.lastName}{" "}
                  <CTooltip content={user.email}>
                    <CIcon name="cil-envelope-closed" className="mb-2" />
                  </CTooltip>
                </div>
              ))}
            </td>
          ),
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
