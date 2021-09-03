import { CCardBody, CCollapse, CDataTable, CPagination } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../../service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: "3%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "semester", label: "Học kỳ", _style: { width: "10%" } },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Ngành" },
  { key: "guideTeacherNames", label: "Giáo viên hướng dẫn" },
];

const MainComponent = ({ thesis }) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`/topics/${thesis ? "thesis" : "outline"}?page=${newPage}`);
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    api.get(`/topics/${thesis ? "thesis" : "outline"}-flat`).then(setData);
  }, [currentPage, page]);

  return (
    <div>
      <CDataTable
        items={data}
        fields={fields}
        hover
        striped
        sorter
        columnFilter
        itemsPerPage={size}
        activePage={page}
        clickableRows
        onRowClick={(item, index) => toggleDetails(index)}
        scopedSlots={{
          names: (item) => multiLine(item.names),
          educationMethodNames: (item) => multiLine(item.educationMethodNames),
          majorNames: (item) => multiLine(item.majorNames),
          guideTeacherNames: (item) => multiLine(item.guideTeacherNames),
          details: (item, index) => {
            return (
              <CCollapse show={details.includes(index)}>
                <CCardBody>
                  <h4>{item.id}</h4>
                </CCardBody>
              </CCollapse>
            );
          },
        }}
      />
      <CPagination
        activePage={page}
        onActivePageChange={pageChange}
        align="center"
      />
    </div>
  );
};

const multiLine = (array) => (
  <td>
    {array?.map((e) => (
      <tr>{e}</tr>
    ))}
  </td>
);

export default MainComponent;
