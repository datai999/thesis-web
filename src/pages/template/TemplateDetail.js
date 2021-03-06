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
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";
import toastHolder from "src/service/toastService";
import Criterion from "./Criterion";

const MainComponent = ({ location }) => {
  const history = useHistory();

  const paths = window.location.pathname.split("/");
  const semesterName = window.location.pathname.match(
    /templates\/(\d+)/,
    ""
  )[1];
  const create = paths.at(-1) === "create";
  const templateId = create ? null : paths.at(-1);

  const [data, setData] = useState({
    thesis: false,
    midSemester: false,
    numberMark: false,
    guideTeacher: false,
    reviewTeacher: false,
    majors: [],
    councilRoles: [],
  });
  const [edit, setEdit] = useState(!create ? false : true);
  const [review, setReview] = useState(false);
  const [councilRoles, setCouncilRoles] = useState([]);
  const [semester, setSemester] = useState({});

  const isCurrentSemester =
    context.semester?.name === semesterName &&
    semesterName === data.semesterName;

  const reviewing = () => {
    setReview(true);
    setEdit(false);
  };

  const editing = () => {
    setReview(false);
    setEdit(true);
  };

  const [scores, setScores] = useState([]);
  const toInt = (input) => (parseInt(input) ? parseInt(input) : 0);
  const updateScore = (score) => {
    if (score.score === "") {
      score.score = null;
    } else {
      score.score = data?.numberMark
        ? toInt(score.score)
        : score.score?.toUpperCase();
    }
    const index = scores.findIndex(
      (e) => e.criterion.id === score.criterion.id
    );
    if (index < 0) {
      setScores([...scores, score]);
    } else {
      let nextScores = scores.slice();
      nextScores[index] = score;
      setScores(nextScores);
    }
  };

  const submit = () => {
    setReview(false);
    if (!data.rootCriterion) data.rootCriterion = {};
    if (data.id)
      api.patch(`/templates`, data).then((response) => {
        toastHolder.success(
          `C???p nh???t m???u ti??u ch?? s??? ${response.id} th??nh c??ng`
        );
        setData(response);
      });
    else
      api
        .post(`/templates`, { ...data, semester: { id: semester.id } })
        .then((response) => {
          history.push(
            window.location.pathname.substring(
              0,
              window.location.pathname.lastIndexOf("/")
            )
          );
          toastHolder.success("T???o m???u ti??u ch?? th??nh c??ng");
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
    if (!create) {
      if (location?.state) setData(location?.state);
      else api.get(`/templates/detail/${templateId}`).then(setData);
    }
    api.post(`/semesters/example`, { name: semesterName }).then((res) => {
      setSemester(res[0]);
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
      .map((e) => e.name + " h???i ?????ng");
    if (data.guideTeacher) result = ["Gi??o vi??n h?????ng d???n", ...result];
    if (data.reviewTeacher) result = ["Gi??o vi??n ph???n bi???n", ...result];
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
                    {data.id
                      ? `M?? s??? ${data.id} : ${data.name}`
                      : "T???o m???u ti??u ch??"}
                  </strong>
                </center>
              </h5>
            </CCol>
            <CCol md="0">
              {isCurrentSemester && !create && !edit && !review && (
                <CTooltip content={"Ch???nh s???a m???u ti??u ch??"}>
                  <CButton color="primary" onClick={editing}>
                    <CIcon name="cil-pencil" /> Ch???nh s???a
                  </CButton>
                </CTooltip>
              )}

              {review && (
                <>
                  <CTooltip content={"Ch???nh s???a m???u ti??u ch??"}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={editing}
                    >
                      <CIcon name="cil-pencil" /> So???n th???o
                    </CButton>
                  </CTooltip>
                  <CButton color="primary" variant="outline" onClick={submit}>
                    <CIcon name="cil-save" /> L??u
                  </CButton>
                </>
              )}

              {(create || edit) && !review && (
                <CButton color="primary" variant="outline" onClick={reviewing}>
                  <CIcon name="cil-save" /> Xem tr?????c
                </CButton>
              )}
            </CCol>
          </CRow>

          {edit && (
            <CFormGroup row>
              <strong>T??n m???u ti??u ch??</strong>
              <CInput {...setGetForm("name")} />
            </CFormGroup>
          )}

          {edit ? (
            <CRow>
              <CCol md="4">
                <CFormGroup row>
                  <CCol md="0">
                    <strong>Lo???i ????? t??i</strong>
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
                        ????? c????ng
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
                        Lu???n v??n
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <strong>S??? d???ng thang ??i???m s???</strong>
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
                    <strong>Chuy??n ng??nh</strong>
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
                    <strong>Ng?????i ????nh gi??</strong>
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
                        Gi??o vi??n h?????ng d???n
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
                          Gi??o vi??n ph???n bi???n
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
                            {e.name} h???i ?????ng
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
                  {/* <CRow>
                    <CCol md="0">
                      <strong>Lo???i ????? t??i: </strong>
                    </CCol>
                    <CCol>{data.thesis ? "Lu???n v??n" : "????? c????ng"}</CCol>
                  </CRow> */}
                  <CRow>
                    <CCol md="0">
                      <strong>Lo???i ??i???m: </strong>
                    </CCol>
                    <CCol>{data.midSemester ? "Gi???a k???" : "Cu???i k???"}</CCol>
                  </CRow>
                  <CRow>
                    <CCol md="0">
                      <strong>Thang ??i???m s???: </strong>
                    </CCol>
                    <CCol>{data.numberMark ? "C??" : "Kh??ng"}</CCol>
                  </CRow>
                </CCol>
                <CCol>
                  <CRow>
                    <CCol md="0">
                      <strong>Chuy??n ng??nh: </strong>
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
                      <strong>Ng?????i ????nh gi?? ??i???m: </strong>
                    </CCol>
                    <CCol>{renderTeachers()}</CCol>
                  </CRow>
                </CCol>
              </CRow>
            </div>
          )}
        </CCardHeader>
        <CCardBody className="pl-0 mr-2">
          <div className="ml-4">
            {edit ? (
              <CFormGroup row className="ml-1">
                <CCol md="0">
                  <strong>M?? t???</strong>
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
                  <strong>M?? t???: </strong>
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
            scores={scores}
            updateScore={updateScore}
          />
        </CCardBody>
      </CForm>
    </CCard>
  );
};

export default MainComponent;
