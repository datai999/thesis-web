import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCol,
  CFormGroup,
  CInput,
  CInputRadio,
  CLabel,
  CRow,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { Chrono } from "react-chrono";

const MainComponent = ({ form, thesis, setValueForm, setGetForm }) => {
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
        <strong>
          Mốc thời gian giai đoạn {thesis ? "Luận văn" : "Đề cương"}
        </strong>
        {form?.status !== "USED" && (
          <CTooltip
            content={`Sao chép thông tin ${thesis ? "đề cương" : "luận văn"}`}
          >
            <CButton
              size="sm"
              color="info"
              variant="ghost"
              style={{
                position: "absolute",
                left: 290,
              }}
              onClick={() => {
                setValueForm(basePath, form[toggleBasePath]);
              }}
            >
              <CIcon name="cil-file" />
            </CButton>
          </CTooltip>
        )}
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
