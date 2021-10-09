import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCollapse,
  CDataTable,
  CPagination,
  CTooltip
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import TopicLineDetail from "./TopicLineDetail";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "names", label: "Tên đề tài" },
  { key: "semester", label: "Học kỳ", _style: { width: 1 } },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Ngành", _style: { width: "12%" } },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];

const MainComponent = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/my/topics/guide?page=${newPage}`);
    setPage(newPage);
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

  const getData = async () => {
    const userId = await window.localStorage.getItem("userId");
    api
      .get(`/topics/user`, {
        params: {
          userId: userId,
          topicRole: "REVIEW_TEACHER",
          direction: "DESC",
        },
      })
      .then(setData);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <div>
      <CDataTable
        size="sm"
        items={data}
        fields={fields}
        hover
        sorter
        columnFilter
        tableFilter
        itemsPerPageSelect
        itemsPerPage={size}
        activePage={page}
        clickableRows
        scopedSlots={{
          names: (item) => multiLine(item.names),
          educationMethodNames: (item) => multiLine(item.educationMethodNames),
          majorNames: (item) => multiLine(item.majorNames),
          actions: (item, index) => (
            <CButtonGroup vertical size="sm">
              <CTooltip
                content={details.includes(index) ? "Ẩn bớt" : "Chi tiết"}
              >
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => {
                    toggleDetails(index);
                  }}
                >
                  <CIcon
                    name={`cil-chevron-${
                      details.includes(index) ? "top" : "bottom"
                    }`}
                  />
                </CButton>
              </CTooltip>
            </CButtonGroup>
          ),
          details: (item, index) => (
            <CCollapse show={details.includes(index)}>
              <TopicLineDetail item={item} index={index} />
            </CCollapse>
          ),
        }}
      />
      <CPagination
        size="sm"
        activePage={page}
        onActivePageChange={pageChange}
        align="center"
      />
    </div>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;
