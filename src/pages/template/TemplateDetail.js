import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CInputRadio,
  CLabel,
  CRow,
  CSwitch,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";
import toastHolder from "src/service/toastService";
import Criterion from "./Criterion";

const MainComponent = () => {
  const canEdit = loginUserHasAny([PERMISSIONS.EDUCATION_STAFF]);

  const history = useHistory();
  const templateIdPath = useLocation().pathname.match(/templates\/(\d+)/, "");
  const [data, setData] = useState({
    thesis: false,
    midSemester: false,
    numberMark: false,
    guideTeacher: false,
    reviewTeacher: false,
    majors: [],
    councilRoles: [],
  });
  const [edit, setEdit] = useState(templateIdPath ? false : true);
  const [review, setReview] = useState(false);
  const [councilRoles, setCouncilRoles] = useState([]);

  const reviewing = () => {
    setReview(true);
    setEdit(false);
  };

  const editing = () => {
    setReview(false);
    setEdit(true);
  };

  const submit = () => {
    setReview(false);
    if (templateIdPath)
      api.patch(`/templates`, data).then((response) => {
        toastHolder.success(
          `Cập nhật mẫu tiêu chí số ${response.id} thành công`
        );
        setData(response);
      });
    else
      api.post(`/templates`, data).then((response) => {
        history.push(`/templates/${response.id}`);
        toastHolder.success("Tạo mẫu tiêu chí thành công");
      });
  };

  const setValueForm = (path, value) => {
    let nextForm = _.cloneDeep(data);
    _.set(nextForm, path, value);
    setData(nextForm);
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(data, getPath),
      onChange: (e) => setValueForm(getPath ?? setPath, e.target.value),
    };
  };

  const onChangeCheck = (event, path) => {
    const id = parseInt(event.currentTarget.value);
    let current = _.get(data, path);
    if (current.map((e) => e.id).includes(id)) {
      current = current.filter((element) => element.id !== id);
    } else {
      current.push({ id });
    }
    setValueForm(path, current);
  };

  const toggleCheck = (path) => {
    let current = _.get(data, path);
    setValueForm(path, !current);
  };

  useEffect(() => {
    templateIdPath &&
      api.get(`/templates/detail/${templateIdPath[1]}`).then((res) => {
        setData(res);
      });
    api
      .get(`/council-roles`, { params: { sort: "displayOrder" } })
      .then(setCouncilRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTeachers = () => {
    const temp = data.councilRoles.map((e) => e.id);
    let result = [...councilRoles]
      .filter((e) => temp.includes(e.id))
      .map((e) => e.name + " hội đồng");
    if (data.guideTeacher) result = ["Giáo viên hướng dẫn", ...result];
    if (data.reviewTeacher) result = ["Giáo viên phản biện", ...result];
    return result.join(", ");
  };

  return (
    <CCard>
      <CForm>
        <CCardHeader className="mx-3">
          <CRow>
            <CCol className="mt-2 mb-2">
              <h5>
                <center>
                  <strong>
                    {templateIdPath
                      ? `Mã số ${data.id} : ${data.name}`
                      : "Tạo mẫu tiêu chí"}
                  </strong>
                </center>
              </h5>
            </CCol>
            <CCol md="0">
              {canEdit && templateIdPath && !edit && !review && (
                <CTooltip content={"Chỉnh sửa mẫu tiêu chí"}>
                  <CButton color="primary" onClick={editing}>
                    <CIcon name="cil-pencil" /> Chỉnh sửa
                  </CButton>
                </CTooltip>
              )}

              {review && (
                <>
                  <CTooltip content={"Chỉnh sửa mẫu tiêu chí"}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={editing}
                    >
                      <CIcon name="cil-pencil" /> Soạn thảo
                    </CButton>
                  </CTooltip>
                  <CButton color="primary" variant="outline" onClick={submit}>
                    <CIcon name="cil-save" /> Lưu
                  </CButton>
                </>
              )}

              {edit && (
                <CButton color="primary" variant="outline" onClick={reviewing}>
                  <CIcon name="cil-save" /> Xem trước
                </CButton>
              )}
            </CCol>
          </CRow>

          {edit && (
            <CFormGroup row>
              <strong>Tên mẫu tiêu chí</strong>
              <CInput {...setGetForm("name")} />
            </CFormGroup>
          )}

          {edit ? (
            <CRow>
              <CCol md="4">
                <CFormGroup row>
                  <CCol md="0">
                    <strong>Loại đề tài</strong>
                  </CCol>
                  <CCol>
                    <CFormGroup variant="custom-radio">
                      <CInputRadio
                        custom
                        id="nonThesis"
                        name="type"
                        checked={!data.thesis}
                        value={false}
                        onChange={() => setValueForm("thesis", false)}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="nonThesis">
                        Đề cương
                      </CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio
                        custom
                        id="thesis"
                        name="type"
                        checked={data.thesis}
                        onChange={() => setValueForm("thesis", true)}
                        value={true}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="thesis">
                        Luận văn
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="0">
                    <strong>Loại điểm</strong>
                  </CCol>
                  <CCol>
                    <CFormGroup variant="custom-radio">
                      <CInputRadio
                        custom
                        id="midSemester"
                        name="timeSemester"
                        checked={data.midSemester}
                        value={true}
                        onChange={() => {
                          data.guideTeacher = true;
                          data.reviewTeacher = false;
                          data.councilRoles = [];
                          setValueForm("midSemester", true);
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="midSemester">
                        Giữa kỳ
                      </CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio
                        custom
                        id="finalSemester"
                        name="timeSemester"
                        checked={!data.midSemester}
                        onChange={() => setValueForm("midSemester", false)}
                        value={false}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="finalSemester">
                        Cuối kỳ
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <strong>Sử dụng thang điểm số</strong>
                  <CSwitch
                    color="primary"
                    labelOn={"\u2713"}
                    labelOff={"\u2715"}
                    className="ml-3"
                    defaultChecked={data.numberMark}
                    onChange={(e) =>
                      setValueForm("numberMark", e.currentTarget.checked)
                    }
                  />
                </CFormGroup>
              </CCol>

              <CCol>
                <CFormGroup row>
                  <CCol md="0">
                    <strong>Chuyên ngành</strong>
                  </CCol>
                  <CCol>
                    {context.majors.map((major) => (
                      <CFormGroup key={major.id} variant="custom-checkbox">
                        <CInputCheckbox
                          custom
                          id={"major" + major.id}
                          name="major"
                          value={major.id}
                          onChange={(event) => onChangeCheck(event, "majors")}
                          checked={data.majors?.some((e) => {
                            return [e, e.id].includes(major.id);
                          })}
                        />
                        <CLabel
                          variant="custom-checkbox"
                          htmlFor={"major" + major.id}
                        >
                          {major.name}
                        </CLabel>
                      </CFormGroup>
                    ))}
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="0">
                    <strong>Người đánh giá</strong>
                  </CCol>
                  <CCol>
                    <CFormGroup variant="custom-checkbox">
                      <CInputCheckbox
                        custom
                        id={"guideTeacher"}
                        name="major"
                        checked={data.guideTeacher}
                        onChange={() => toggleCheck("guideTeacher")}
                      />
                      <CLabel
                        variant="custom-checkbox"
                        htmlFor={"guideTeacher"}
                      >
                        Giáo viên hướng dẫn
                      </CLabel>
                    </CFormGroup>

                    {!data.midSemester && (
                      <CFormGroup variant="custom-checkbox">
                        <CInputCheckbox
                          custom
                          id={"reviewTeacher"}
                          name="major"
                          checked={data.reviewTeacher}
                          onChange={() => toggleCheck("reviewTeacher")}
                        />
                        <CLabel
                          variant="custom-checkbox"
                          htmlFor={"reviewTeacher"}
                        >
                          Giáo viên phản biện
                        </CLabel>
                      </CFormGroup>
                    )}

                    {!data.midSemester &&
                      councilRoles.map((e) => (
                        <CFormGroup key={e.id} variant="custom-checkbox">
                          <CInputCheckbox
                            custom
                            id={"councilRoles" + e.id}
                            name="councilRoles"
                            value={e.id}
                            onChange={(event) =>
                              onChangeCheck(event, "councilRoles")
                            }
                            checked={data.councilRoles?.some((councilRole) =>
                              [e, e.id].includes(councilRole.id)
                            )}
                          />
                          <CLabel
                            variant="custom-checkbox"
                            htmlFor={"councilRoles" + e.id}
                          >
                            {e.name} hội đồng
                          </CLabel>
                        </CFormGroup>
                      ))}
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
          ) : (
            <div className="ml-4">
              <CRow>
                <CCol md="2">
                  <CRow>
                    <CCol md="0">
                      <strong>Loại đề tài: </strong>
                    </CCol>
                    <CCol>{data.thesis ? "Luận văn" : "Đề cương"}</CCol>
                  </CRow>
                  <CRow>
                    <CCol md="0">
                      <strong>Loại điểm: </strong>
                    </CCol>
                    <CCol>{data.midSemester ? "Giữa kỳ" : "Cuối kỳ"}</CCol>
                  </CRow>
                </CCol>
                <CCol>
                  <CRow>
                    <CCol md="0">
                      <strong>Chuyên ngành: </strong>
                    </CCol>
                    <CCol>
                      {context.majors
                        .filter((e) =>
                          data.majors.map((major) => major.id).includes(e.id)
                        )
                        .map((e) => e.name)
                        .join(", ")}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="0">
                      <strong>Người đánh giá điểm: </strong>
                    </CCol>
                    <CCol>{renderTeachers()}</CCol>
                  </CRow>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="0">
                  <strong>Thang điểm số: </strong>
                </CCol>
                <CCol>{data.numberMark ? "Có" : "Không"}</CCol>
              </CRow>
            </div>
          )}
        </CCardHeader>
        <CCardBody className="pl-0 mr-2">
          <div className="ml-4">
            {edit ? (
              <CFormGroup row className="ml-1">
                <CCol md="0">
                  <strong>Mô tả</strong>
                </CCol>
                <CCol>
                  <CKEditor
                    editor={ClassicEditor}
                    data={data.description}
                    onChange={(event, editor) =>
                      setValueForm("description", editor.getData())
                    }
                  />
                </CCol>
              </CFormGroup>
            ) : (
              <CRow className="ml-1">
                <CCol md="0">
                  <strong>Mô tả: </strong>
                </CCol>
                <CCol className="mb-2">
                  <div dangerouslySetInnerHTML={{ __html: data.description }} />
                </CCol>
              </CRow>
            )}
          </div>

          <Criterion
            criterion={data.rootCriterion}
            deep={0}
            edit={edit}
            updateCriterion={(nextCriterion) => {
              const nextData = { ...data, rootCriterion: nextCriterion };
              setData(nextData);
            }}
          />
        </CCardBody>
      </CForm>
    </CCard>
  );
};

export default MainComponent;
