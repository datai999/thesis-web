import CIcon from "@coreui/icons-react";
import { CBadge, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TableWithDetail from "src/components/TableWithDetail";
import api from "src/service/api";
import context from "src/service/contextService";
import {
  loginUserHasAny,
  loginUserIsStudent,
  PERMISSIONS,
} from "src/service/permissionService";
import RegisterTopicModal from "./RegisterTopicModal";
import StudentRegisterTopicList from "./StudentRegisterTopicList";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Chuyên ngành" },
  { key: "subjectDepartmentName", label: "Bộ môn" },
  { key: "guideTeachers", label: "Giáo viên hướng dẫn" },
  { key: "studentCount", label: "Số SV đăng ký", _style: { width: "1%" } },
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
  const semesterName = window.location.pathname.split("/").pop();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [registerTopicModal, setRegisterTopicModal] = useState(false);
  const [topicRegister, setTopicRegister] = useState();

  const getData = () => {
    setLoading(true);
    api
      .post(
        `/topics/example`,
        {
          thesis,
          semester: {
            name: semesterName,
          },
          subjectDepartment: context.user.subjectDepartment?.id,
          educationMethods: loginUserIsStudent()
            ? [context.user.educationMethod?.id]
            : null,
          majors: loginUserIsStudent() ? [context.user.major?.id] : null,
        },
        { params: { direction: "DESC" } }
      )
      .then((response) => {
        response.forEach((e) => {
          e.studentCount = `${
            e.students?.length === e.maxStudentTake ? "Đủ" : "Đã đăng ký"
          }  ${e.students?.length}/${e.maxStudentTake}`;
        });
        setData(response);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

  if (loading) throw new Promise(() => {});

  return (
    <>
      <TableWithDetail
        fields={
          loginUserHasAny([
            PERMISSIONS.HEAD_SUBJECT_DEPARTMENT,
            PERMISSIONS.TEACHER,
          ])
            ? fields.filter((e) => e.key !== "subjectDepartmentName")
            : fields
        }
        items={data}
        DetailComponent={({ item }) => (
          <StudentRegisterTopicList
            item={item}
            setTopicRegister={setTopicRegister}
            setRegisterTopicModal={setRegisterTopicModal}
          />
        )}
        scopedSlots={{
          names: (item) => multiLine(item.names),
          educationMethodNames: (item) => multiLine(item.educationMethodNames),
          majorNames: (item) => multiLine(item.majorNames),
          guideTeachers: (item) => (
            <td>
              {item.guideTeachers?.map((guideTeacher) => (
                <tr>
                  {guideTeacher.code} {guideTeacher.firstName}{" "}
                  {guideTeacher.lastName}{" "}
                  <CTooltip content={guideTeacher.email}>
                    <CIcon name="cil-envelope-closed" className="mb-1" />
                  </CTooltip>
                </tr>
              ))}
            </td>
          ),
          studentCount: (item) => (
            <td className="py-2">
              <CBadge color={item.status === "FULL" ? "success" : "secondary"}>
                {item.studentCount}
              </CBadge>
            </td>
          ),
        }}
      />
      <RegisterTopicModal
        view={registerTopicModal}
        disableView={() => setRegisterTopicModal(false)}
        confirm={() => history.push("/my/topics/execute")}
        topic={topicRegister}
      />
    </>
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
