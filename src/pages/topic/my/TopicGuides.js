import {
  CButton,
  CCardBody,
  CCol,
  CCollapse,
  CDataTable,
  CListGroupItem,
  CPagination,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài", _style: { width: "30%" } },
  { key: "semester", label: "Học kỳ", _style: { width: "1%" } },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Ngành", _style: { width: "10%" } },
  {
    key: "studentCodeNames",
    label: "Sinh viên thực hiện",
    _style: { width: "25%" },
  },
  {
    key: "studentsEmails",
    label: "Email sinh viên",
    _style: { width: "10%" },
  },
  {
    key: "actions",
    label: "",
    _style: { width: "1%" },
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
          topicRole: "GUIDE_TEACHER",
          direction: "DESC",
        },
      })
      .then((response) => {
        response.forEach((element) => {
          element.studentCodeNames = element.students.map(
            (student) =>
              student.code + " " + student.firstName + " " + student.lastName
          );
          element.studentsEmails = element.students.map(
            (student) => student.email
          );
        });
        setData(response);
      });
  };

  useEffect(() => {
    getData();
  }, [page]);

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
          studentCodeNames: (item) =>
            multiLine(
              item.students.map((student) => (
                <div>
                  {student.code} {student.firstName} {student.lastName}
                </div>
              ))
            ),
          studentsEmails: (item) => multiLine(item.studentsEmails),
          actions: (item, index) => (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  history.push("/my/topics/edit", item);
                }}
              >
                Chỉnh sửa
              </CButton>
              <br />
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
          details: (item, index) => (
            <CCollapse show={details.includes(index)}>
              <CCardBody>
                <CRow>
                  <CCol md="4">
                    Mô tả
                    <br />
                    {item.description}
                  </CCol>
                  <CCol md="5">
                    Nhiệm vụ
                    <br />
                    {item.task}
                    <br />
                    Tài liệu
                    <br />
                    {item.documentReference}
                  </CCol>
                  <CCol>
                    Giáo viên hướng dẫn:
                    <br />
                    {item.guideTeachers.map((guideTeacher) => (
                      <CListGroupItem key={guideTeacher}>
                        <CRow>
                          <CCol>{guideTeacher.degree}</CCol>
                          <CCol>{guideTeacher.code}</CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            {guideTeacher.firstName} {guideTeacher.lastName}
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>{guideTeacher.email}</CCol>
                        </CRow>
                      </CListGroupItem>
                    ))}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCollapse>
          ),
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

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;
