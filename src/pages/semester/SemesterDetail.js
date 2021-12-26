import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputRadio,
  CInvalidFeedback,
  CLabel,
  CRow,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import toastHolder from "src/service/toastService";

const MainComponent = ({ defaultForm = {} }) => {
  const history = useHistory();
  const semesterId = window.location.pathname.split("/").pop();
  const [form, setForm] = useState(defaultForm);

  const submit = () => {
    if (form.id) {
      api.patch("/semesters", form).then((response) => {
        history.push(`/semesters`);
        toastHolder.success("Cập nhật thông tin học kỳ thành công");
      });
    } else {
      api.post(`/semesters`, form).then((response) => {
        history.push(`/semesters`);
        toastHolder.success("Tạo học kỳ thành công");
      });
    }
  };

  const setValueForm = (path, value) => {
    let nextForm = _.cloneDeep(form);
    _.set(nextForm, path, value);
    setForm(nextForm);
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(form, getPath),
      onChange: (e) => {
        let nextForm = _.cloneDeep(form);
        _.set(nextForm, getPath ?? setPath, e.target.value);
        setForm(nextForm);
      },
    };
  };

  useEffect(() => {
    semesterId !== "create" &&
      api.get(`/semesters/detail/${semesterId}`).then(setForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader closeButton>
        <h5>
          <strong>
            {form.id ? `Chỉnh sửa học kỳ mã số ${form.id}` : "Tạo kỳ mới"}
          </strong>
        </h5>
      </CCardHeader>
      <CCardBody className="px-3">
        <CForm>
          <CFormGroup row>
            <CCol md="0" className="ml-3 mt-2">
              <CLabel htmlFor="name">
                <strong>Tên học kỳ</strong>
              </CLabel>
            </CCol>
            <CCol md="2">
              <CInput
                id="name"
                placeholder="211, 212, 213, ..."
                // invalid={!form.name}
                valid={form.name}
                // required
                {...setGetForm("name")}
              />
              {!form.name && (
                <CInvalidFeedback>Học kỳ không được để trống</CInvalidFeedback>
              )}
            </CCol>
          </CFormGroup>

          <SemesterType
            form={form}
            thesis={false}
            setValueForm={setValueForm}
            setGetForm={setGetForm}
          />
          <br />
          <SemesterType
            form={form}
            thesis={true}
            setValueForm={setValueForm}
            setGetForm={setGetForm}
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton color="primary" onClick={submit}>
          Xác nhận
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

const SemesterType = ({ form, thesis, setValueForm, setGetForm }) => {
  const basePath = thesis ? "thesis" : "outline";
  const toggleBasePath = thesis ? "outline" : "thesis";

  const semesterTimeLine = form[basePath] ?? {};

  const baseItems = [
    {
      title: semesterTimeLine.createTopicStart,
      cardTitle: "Giáo viên bắt đầu ra đề tài",
    },
    {
      title: semesterTimeLine.createTopicEnd,
      cardTitle: "Kết thúc ra đề tài",
    },
    {
      title: semesterTimeLine.midMarkStart,
      cardTitle: "Giáo viên bắt đầu đánh giá giữa kỳ",
    },
    {
      title: semesterTimeLine.midMarkEnd,
      cardTitle: "Kết thúc đánh giá giữa kỳ",
    },
    {
      title: semesterTimeLine.registerTopicStart,
      cardTitle: "Sinh viên bắt đầu đăng ký đề tài",
    },
    {
      title: semesterTimeLine.registerTopicEnd,
      cardTitle: "Kết thúc đăng ký đề tài",
    },
    {
      type: "outline",
      title: semesterTimeLine.executeTopicStart,
      cardTitle: "Sinh viên bắt đầu hiện thực đề tài",
    },
    {
      title: semesterTimeLine.executeTopicEnd,
      cardTitle: "Kết thúc hiện thực đề tài",
    },
    {
      title: new Date().toLocaleString(),
      cardTitle: "Hiện tại",
    },
  ];

  const items = baseItems
    .sort((a, b) => {
      let dateA = new Date(a.title),
        dateB = new Date(b.title);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    })
    .map((e) => {
      e.title = new Date(e.title)
        .toLocaleString("en-GB")
        .replace(/,/, "")
        .replace(/:\d{2}$/, "");
      // e.title = <small>{e.title}</small>;
      e.title = "";
      return e;
    });

  return (
    <>
      <h5>
        <strong>{thesis ? "Luận văn" : "Đề cương"}</strong>
        <CTooltip
          content={`Sao chép thông tin ${thesis ? "đề cương" : "luận văn"}`}
        >
          <CButton
            size="sm"
            color="info"
            variant="ghost"
            style={{
              position: "absolute",
              left: 90,
            }}
            onClick={() => {
              setValueForm(basePath, form[toggleBasePath]);
            }}
          >
            <CIcon name="cil-file" />
          </CButton>
        </CTooltip>
      </h5>

      <CRow className="border m-0 py-2">
        <CCol md="7">
          <SemesterProperty
            thesis={thesis}
            setValueForm={(path, value) =>
              setValueForm(`${basePath}.${path}`, value)
            }
            setGetForm={(setPath, getPath) =>
              setGetForm(`${basePath}.${setPath}`, `${basePath}.${getPath}`)
            }
            defaultMid={form[basePath]?.defaultMid ?? true}
          />
        </CCol>
        <CCol style={{ height: 400 }}>
          <Chrono
            items={items}
            mode="VERTICAL_ALTERNATING"
            slideShow
            disableNavOnKey
            hideControls
            allowDynamicUpdate={true}
            useReadMore={false}
            cardHeight={1}
            flipLayout={false}
          />
        </CCol>
      </CRow>
    </>
  );
};

const SemesterProperty = ({ thesis, setValueForm, setGetForm, defaultMid }) => {
  return (
    <>
      <CRow>
        <CCol md="0" className="ml-3">
          <CLabel>
            <strong>Kết quả giữa kỳ ban đầu</strong>
          </CLabel>
        </CCol>
        <CFormGroup variant="custom-radio" className="ml-3">
          <CInputRadio
            custom
            id={"pass" + thesis}
            name={"defaultMid" + thesis}
            checked={defaultMid}
            onChange={() => setValueForm("defaultMid", true)}
          />
          <CLabel variant="custom-checkbox" htmlFor={"pass" + thesis}>
            Đạt
          </CLabel>
        </CFormGroup>
        <CFormGroup variant="custom-radio" className="ml-2">
          <CInputRadio
            custom
            id={"fail" + thesis}
            name={"defaultMid" + thesis}
            checked={!defaultMid}
            onChange={() => setValueForm("defaultMid", false)}
          />
          <CLabel variant="custom-checkbox" htmlFor={"fail" + thesis}>
            Không đạt
          </CLabel>
        </CFormGroup>
      </CRow>

      <div className="border px-2 pt-2">
        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Giáo viên ra đề tài</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("createTopicStart")}
              />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("createTopicEnd")} />
            </CCol>
          </CRow>
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Giáo viên đánh giá giữa kỳ</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("midMarkStart")} />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("midMarkEnd")} />
            </CCol>
          </CRow>
        </CFormGroup>
      </div>

      <br />

      <div className="border px-2 pt-2">
        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Sinh viên đăng kí đề tài</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("registerTopicStart")}
              />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("registerTopicEnd")}
              />
            </CCol>
          </CRow>
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Sinh viên hiện thực</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("executeTopicStart")}
              />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("executeTopicEnd")}
              />
            </CCol>
          </CRow>
        </CFormGroup>
      </div>
    </>
  );
};

export default MainComponent;
