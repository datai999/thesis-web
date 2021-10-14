import CIcon from "@coreui/icons-react";
import { CBadge, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TableWithDetail from "src/components/TableWithDetail";
import api from "src/service/api";
import RegisterTopicModal from "./RegisterTopicModal";
import StudentRegisterTopicList from "./StudentRegisterTopicList";

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
  const [data, setData] = useState([]);
  const [registerTopicModal, setRegisterTopicModal] = useState(false);
  const [topicRegister, setTopicRegister] = useState();

  useEffect(() => {
    api
      .get(`/topics/type`, {
        params: { type: thesis ? "thesis" : "outline", direction: "DESC" },
      })
      .then((response) => {
        response.forEach((e) => {
          e.studentCount = `${
            e.students.length === e.maxStudentTake ? "Đủ" : "Đã đăng ký"
          }  ${e.students.length}/${e.maxStudentTake}`;
        });
        setData(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TableWithDetail
        fields={fields}
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
