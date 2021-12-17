import CIcon from "@coreui/icons-react";
import { CBadge, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import {
  loginUserHasAny,
  loginUserIsEduStaff,
  loginUserIsStudent,
  PERMISSIONS,
} from "src/service/permissionService";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  {
    key: "educationMethodNames",
    label: "Đào tạo",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Chuyên ngành" },
  { key: "subjectDepartmentName", label: "Bộ môn" },
  { key: "guideTeachers", label: "Giáo viên hướng dẫn" },
  { key: "studentCount", label: "Số SV đăng ký", _style: { width: 100 } },
];

const MainComponent = ({ thesis }) => {
  const semesterName = window.location.pathname.split("/").pop();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

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
            e.students?.length === e.maxStudentTake ? "Đủ sinh viên" : "Đăng ký"
          }  ${e.students?.length}/${e.maxStudentTake}`.toString();
        });
        if (loginUserIsEduStaff())
          response = response.filter((e) => e.students?.length > 0);
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
      <BaseTable
        fields={
          loginUserHasAny([
            PERMISSIONS.HEAD_SUBJECT_DEPARTMENT,
            PERMISSIONS.TEACHER,
          ])
            ? fields.filter((e) => e.key !== "subjectDepartmentName")
            : fields
        }
        items={data}
        selectSemester={true}
        tableProps={{
          clickableRows: true,
          onRowClick: (item) =>
            window.open(`/topics/${item.id}`, "_blank").focus(),
        }}
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
              {item.students?.length === item.maxStudentTake ? (
                <CBadge color={"success"}>{item.studentCount}</CBadge>
              ) : (
                item.studentCount
              )}
            </td>
          ),
        }}
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
