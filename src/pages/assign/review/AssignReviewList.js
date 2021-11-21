import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CListGroupItem,
  CRow,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
import api from "src/service/api";
import { fields, scopedSlots } from "src/service/topicService";

const assignReviewFields = [
  ...fields.filter(
    (e) => !["subjectDepartmentName", "studentCount"].includes(e.key)
  ),
  {
    key: "reviewTeacherRenders",
    label: "Giáo viên phản biện",
    _style: { width: "20%" },
  },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];

const MainComponent = ({ subjectDepartmentId = 1 }) => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);

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
      .get(`/review-teachers/${subjectDepartmentId}/topic-review`, {
        params: { semesterName },
      })
      .then((response) => {
        response.forEach((e) => {
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
    semesterName !== "assign-review" && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

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
        <h4>Danh sách đề tài cần phân công phản biện</h4>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          fields={assignReviewFields}
          items={data}
          selectSemester
          semesterTop={8}
          scopedSlots={{
            ...scopedSlots,
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
                        <CIcon
                          name="cil-user-follow"
                          className="text-success"
                        />
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
                          if (!details.includes(item.id))
                            toggleDetails(item.id);
                          setCurrentTopicIndex(index);
                        }}
                      >
                        <CIcon name="cil-pencil" />
                      </CButton>
                    </CTooltip>
                    <CTooltip
                      content={
                        details.includes(item.id) ? "Ẩn bớt" : "Chi tiết"
                      }
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
      </CCardBody>
    </CCard>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;
