import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CListGroupItem,
  CPagination,
  CRow,
  CTooltip
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SubjectDepartmentTab from "src/components/SubjectDepartmentTab";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
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
    key: "guideTeacherRenders",
    label: "Giáo viên hướng dẫn",
    _style: { width: "20%" },
  },
  {
    key: "reviewTeacherRenders",
    label: "Giáo viên phản biện",
    _style: { width: "20%" },
  },
  {
    key: "actions",
    label: "",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
];

const CouncilTable = ({ subjectDepartmentId }) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  const size = 5;

  const pageChange = (newPage) => {
    console.log(newPage);
    currentPage !== newPage &&
      history.push(`/assign/review/${subjectDepartmentId}?page=${newPage}`);
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
    api
      .get(`/topics/subject-department`, {
        params: {
          id: subjectDepartmentId,
          direction: "DESC",
        },
      })
      .then((response) => {
        response.forEach((e) => {
          e.guideTeacherRenders = e.guideTeachers.map((user) =>
            `${user.code} ${user.firstName} ${user.lastName} ${user.email}`.toString()
          );
          e.reviewTeacherRenders = e.reviewTeachers.map((user) =>
            `${user.code} ${user.firstName} ${user.lastName} ${user.email}`.toString()
          );
        });
        setData(response);
      });
  };

  const addReviewTeacher = (teacher) => {
    const nextData = _.cloneDeep(data);
    nextData[currentTopicIndex].reviewTeachers = [
      ...data[currentTopicIndex].reviewTeachers,
      teacher,
    ];
    setData(nextData);
  };

  const removeReviewTeacher = (teacher) => {
    const nextReviewTeachers = data[currentTopicIndex].reviewTeachers.filter(
      (e) => e.id !== teacher.id
    );
    const nextData = _.cloneDeep(data);
    nextData[currentTopicIndex].reviewTeachers = nextReviewTeachers;
    setData(nextData);
  };

  const updateTopic = (topic) => {
    api.put(`/topics/${topic.id}/assign-reviews`, topic).then(() => {
      getData();
      setCurrentTopicIndex(-1);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <CCard>
      <TeacherSearchModal
        view={searchTeachers}
        disableView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          addReviewTeacher(teacher);
        }}
      />
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h5 className="card-title mb-0">Danh sách hội đồng</h5>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => {
                history.push(`/councils/${subjectDepartmentId}/create`);
              }}
            >
              Tạo hội đồng mới
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
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
          guideTeacherRenders: (item) =>
            multiLine(
              item.guideTeachers.map((user) => (
                <div>
                  {user.code} {user.firstName} {user.lastName}{" "}
                  <CTooltip content={user.email}>
                    <CIcon name="cil-envelope-closed" className="mb-2" />
                  </CTooltip>
                </div>
              ))
            ),
          reviewTeacherRenders: (item, index) => (
            <td>
              {item.reviewTeachers.map((user) => (
                <div>
                  {user.code} {user.firstName} {user.lastName}{" "}
                  <CTooltip content={user.email}>
                    <CIcon name="cil-envelope-closed" className="mb-2" />
                  </CTooltip>
                  {currentTopicIndex === index && (
                    <CTooltip content={"Xóa giáo viên"}>
                      <CButton
                        color="primary"
                        variant="ghost"
                        size="sm"
                        className="mb-2"
                        onClick={() => {
                          removeReviewTeacher(user);
                        }}
                      >
                        <CIcon
                          name="cil-user-unfollow"
                          className="text-danger"
                        />
                      </CButton>
                    </CTooltip>
                  )}
                </div>
              ))}
            </td>
          ),
          actions: (item, index) => (
            <td className="py-2">
              {currentTopicIndex === index ? (
                <CButtonGroup vertical size="sm">
                  <CTooltip content={"Thêm giáo viên phản biện"}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        setSearchTeachers(true);
                      }}
                    >
                      <CIcon name="cil-user-follow" className="text-success" />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={"Lưu"}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        updateTopic(item);
                      }}
                    >
                      <CIcon name="cil-save" />
                    </CButton>
                  </CTooltip>
                </CButtonGroup>
              ) : (
                <CButtonGroup vertical size="sm">
                  <CTooltip content={"Chỉnh sửa"}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        if (!details.includes(item.id)) toggleDetails(item.id);
                        setCurrentTopicIndex(index);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  </CTooltip>
                  <CTooltip
                    content={details.includes(item.id) ? "Ẩn bớt" : "Chi tiết"}
                  >
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        toggleDetails(item.id);
                      }}
                    >
                      <CIcon
                        name={`cil-chevron-${
                          details.includes(item.id) ? "top" : "bottom"
                        }`}
                      />
                    </CButton>
                  </CTooltip>
                </CButtonGroup>
              )}
            </td>
          ),
          details: (item) => (
            <CCollapse show={details.includes(item.id)}>
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
                    Sinh viên thực hiện
                    <br />
                    {item.students.map((user) => (
                      <CListGroupItem key={user}>
                        <CRow>
                          <CCol>{user.code}</CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            {user.firstName} {user.lastName}
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>{user.email}</CCol>
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
    </CCard>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

const MainComponent = () => (
  <SubjectDepartmentTab URL="/councils" InnerComponent={CouncilTable} />
);

export default MainComponent;
