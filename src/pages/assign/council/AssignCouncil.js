import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
  CSelect,
  CTooltip,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import CouncilInfo from "src/pages/council/CouncilInfo";
import TopicInCouncil from "src/pages/council/TopicInCouncil";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserIsHead } from "src/service/permissionService";
import toastHolder from "src/service/toastService";
import AssignCouncilModal from "./AssignCouncilModal";
import CreateCouncil from "./CreateCouncil";
import TopicAssignList from "./TopicAssignList";

const MainComponent = () => {
  const councilId = window.location.pathname.split("/").pop();
  const head = loginUserIsHead();

  const [assignedTopics, setAssignedTopics] = useState([]);
  const [unassignTopics, setUnassignTopics] = useState([]);
  const [assignTopicModal, setAssignTopicModal] = useState(false);
  const [modalProps, setModalProps] = useState({ topic: {} });
  const [assigning, setAssigning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [council, setCouncil] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [unassignMode, setUnassignMode] = useState(0);
  const [assignMode, setAssignMode] = useState(0);

  const unassignTopicByMode = () => {
    if (unassignMode.toString() === "1") {
      return unassignTopics.filter((e) => {
        const mainTeacherId = e.guideTeachers.find(
          (teacher) => teacher.main
        ).id;
        return council.members.some(
          (member) => member.member?.id === mainTeacherId
        );
      });
    }
    if (unassignMode.toString() === "2") {
      return unassignTopics.filter((e) => {
        let result = true;
        e.guideTeachers.forEach((teacher) => {
          if (
            !council.members.some((member) => member.member?.id === teacher.id)
          )
            result = false;
        });
        return result;
      });
    }
    return unassignTopics;
  };

  const assignTopicByMode = () => {
    if (assignMode.toString() === "1") {
      return assignedTopics.filter((e) => {
        const mainTeacherId = e.guideTeachers.find(
          (teacher) => teacher.main
        ).id;
        return !council.members.some(
          (member) => member.member?.id === mainTeacherId
        );
      });
    }
    if (assignMode.toString() === "2") {
      return assignedTopics.filter((e) => {
        let result = false;
        e.guideTeachers.forEach((teacher) => {
          if (
            !council.members.some((member) => member.member?.id === teacher.id)
          )
            result = true;
        });
        return result;
      });
    }
    return assignedTopics;
  };

  const submit = () => {
    api
      .patch(
        `/councils/${councilId}/assign-topics?topicIds=${assignedTopics.map(
          (e) => e.id
        )}`
      )
      .then(() => {
        toastHolder.success("Phân công hội đồng thành công");
        setAssigning(false);
      });
  };

  const assign = (topic) => {
    setUnassignTopics(unassignTopics.filter((e) => e.id !== topic.id));
    setAssignedTopics([...assignedTopics, topic]);
  };

  const unassign = (topic) => {
    setAssignedTopics(assignedTopics.filter((e) => e.id !== topic.id));
    setUnassignTopics([...unassignTopics, topic]);
  };

  const confirmAssign = (topic, isAssign) => {
    setModalProps({
      topic,
      assign: isAssign,
      confirm: isAssign ? assign : unassign,
    });
    setAssignTopicModal(true);
  };

  const getAssignedTopics = () => {
    api
      .post(`/topics/example`, {
        council: { id: councilId },
      })
      .then(setAssignedTopics);
  };

  const getUnassignTopics = () => {
    api
      .get(`/topics/need-council`, {
        params: { subjectDepartmentId: context.user?.subjectDepartment?.id },
      })
      .then((response) => {
        response.forEach((e) => {
          e.guideTeacherRenders = e.guideTeachers.map((user) =>
            `${user.code} ${user.firstName} ${user.lastName} ${user.email}`.toString()
          );
        });
        setUnassignTopics(response);
      });
  };

  const updateCouncilSuccess = () => {
    setRefresh(!refresh);
    setEditing(false);
    toastHolder.success("Cập nhật thông tin hội đồng thành công");
  };

  useEffect(() => {
    api.get(`/councils/detail/${councilId}`).then((res) => {
      setCouncil(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    getAssignedTopics();
    context.user?.subjectDepartment && getUnassignTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assigning, refresh]);

  return (
    <>
      <AssignCouncilModal
        view={assignTopicModal}
        disableView={() => setAssignTopicModal(false)}
        {...modalProps}
      />

      {editing ? (
        <CreateCouncil
          location={{ state: council }}
          updateCouncilSuccess={updateCouncilSuccess}
        />
      ) : (
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>
                <h5>
                  Hội đồng {council.subjectDepartmentName} mã số {council.id}
                </h5>
              </CCol>
              <CCol>
                <CTooltip content={"Chỉnh sửa thông tin hội đồng"}>
                  <CButton
                    color="primary"
                    className="float-right"
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                </CTooltip>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CouncilInfo council={council} />
          </CCardBody>
        </CCard>
      )}

      {assigning ? (
        <CCard>
          <CCardBody>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="5">
                    <h5 className="card-title mb-0">Đề tài thuộc hội đồng</h5>
                  </CCol>
                  <CCol>
                    <small>
                      <tr>
                        <td></td>
                        <td>
                          <CSelect
                            size="sm"
                            onChange={(event) =>
                              setAssignMode(event.currentTarget.value)
                            }
                          >
                            <option value={0} selected={unassignMode === 0}>
                              ---
                            </option>
                            <option value={1} selected={unassignMode === 1}>
                              GVHD chính không thuộc hội đồng
                            </option>
                            <option value={2} selected={unassignMode === 2}>
                              Có GVHD không thuộc hội đồng
                            </option>
                          </CSelect>
                        </td>
                      </tr>
                    </small>
                  </CCol>
                </CRow>

                <TopicAssignList
                  onRowClick={(topic) => confirmAssign(topic, false)}
                  topics={assignTopicByMode()}
                />
              </CCol>
              <CCol>
                <CRow>
                  <CCol md="5">
                    <h5 className="card-title mb-0">
                      {`Đề tài cần gán hội đồng`}
                    </h5>
                  </CCol>
                  <CCol>
                    <small>
                      <tr>
                        <td></td>
                        <td>
                          <CSelect
                            size="sm"
                            onChange={(event) =>
                              setUnassignMode(event.currentTarget.value)
                            }
                          >
                            <option value={0} selected={unassignMode === 0}>
                              ---
                            </option>
                            <option value={1} selected={unassignMode === 1}>
                              GVHD chính thuộc hội đồng
                            </option>
                            <option value={2} selected={unassignMode === 2}>
                              Tất cả GVHD thuộc hội đồng
                            </option>
                          </CSelect>
                        </td>
                      </tr>
                    </small>
                  </CCol>
                </CRow>
                <TopicAssignList
                  onRowClick={(topic) => confirmAssign(topic, true)}
                  topics={unassignTopicByMode()}
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton color="primary" onClick={submit}>
              <CIcon name="cil-save" /> Lưu kết quả phân công
            </CButton>
          </CCardFooter>
        </CCard>
      ) : (
        <CCard>
          <CCardBody>
            <CRow>
              <CCol>
                <h5 className="card-title mb-0">Đề tài thuộc hội đồng</h5>
              </CCol>
              {head && (
                <CCol>
                  <CTooltip content={"Phân công đề tải thuộc hội đồng"}>
                    <CButton
                      color="primary"
                      className="float-right"
                      onClick={() => {
                        setAssigning(true);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  </CTooltip>
                </CCol>
              )}
            </CRow>
            <TopicInCouncil councilId={council.id} />
          </CCardBody>
        </CCard>
      )}
    </>
  );
};

export default MainComponent;
