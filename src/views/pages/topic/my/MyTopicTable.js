import {
  CButton,
  CCardBody,
  CCol,
  CCollapse,
  CDataTable,
  CPagination,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../../../service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "semester", label: "Học kỳ", _style: { width: "1%" } },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Ngành" },
  { key: "guideTeachers", label: "Giáo viên hướng dẫn" },
  {
    key: "actions",
    label: "",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
];

const MainComponent = ({ thesis }) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [registerTopicModal, setRegisterTopicModal] = useState(false);
  const [topicRegister, setTopicRegister] = useState();
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
    api
      .get(`/topics/${thesis ? "thesis" : "outline"}`, {
        params: { direction: "DESC" },
      })
      .then(setData);
  }, [currentPage, page]);

  return (
    <div>
      <CDataTable
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
          guideTeachers: (item) => (
            <td>
              {item.guideTeachers?.map((guideTeacher) => (
                <tr>
                  {guideTeacher.code} {guideTeacher.firstName}{" "}
                  {guideTeacher.lastName}
                </tr>
              ))}
            </td>
          ),
          actions: (item, index) => (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  toggleDetails(index);
                }}
              >
                {details.includes(index) ? "Ẩn bớt" : "Chi tiết"}
              </CButton>
            </td>
          ),
          details: (item, index) => {
            return (
              <CCollapse show={details.includes(index)}>
                <CCardBody>
                  <CRow>
                    <CCol md="5">
                      Mô tả
                      <br></br>
                      {item.description}
                    </CCol>
                    <CCol md="5">
                      Nhiệm vụ
                      <br></br>
                      {item.task}
                      <br></br>
                      Tài liệu
                      <br></br>
                      {item.documentReference}
                    </CCol>
                    <CCol>
                      Sinh viên:
                      <br></br>
                      {[...Array(item.maxStudentTake).keys()].map((index) => (
                        <div>
                          {item.students && item.students[index] ? (
                            <div>
                              <CRow>
                                <CCol>{item.students[index].firstName}</CCol>
                              </CRow>
                              <CRow>
                                <CCol>{item.students[index].lastName}</CCol>
                                <CCol>{item.students[index].code}</CCol>
                              </CRow>
                            </div>
                          ) : (
                            <CButton
                              type="button"
                              color="info"
                              size="sm"
                              onClick={() => {
                                setTopicRegister(item);
                              }}
                            >
                              Đăng ký
                            </CButton>
                          )}
                          <br></br>
                        </div>
                      ))}
                    </CCol>
                  </CRow>
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
