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
  CRow,
  CTextarea,
  CTooltip
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "src/service/api";
import Criterion from "./Criterion";

const MainComponent = () => {
  const templateId = useLocation().pathname.match(/templates\/([0-9])/, "")[1];
  const [data, setData] = useState({ children: [] });
  const [edit, setEdit] = useState();

  const submit = () => {
    console.log(data);
    setEdit(false);
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

  useEffect(() => {
    api.get(`/criterions/detail/${templateId}`).then((res) => {
      setData(res);
    });
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <CForm>
          <CRow>
            <CCol className="mt-2 mb-2">
              <h5>
                <center>
                  <strong>Mẫu tiêu chí số {data.id} </strong>
                </center>
              </h5>
            </CCol>
            <CCol md="0">
              {edit ? (
                <CButton type="submit" color="primary" onClick={submit}>
                  <CIcon name="cil-save" /> Lưu
                </CButton>
              ) : (
                <CTooltip content={"Chỉnh sửa mẫu tiêu chí"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => setEdit(true)}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                </CTooltip>
              )}
            </CCol>
          </CRow>
          <fieldset disabled={!edit}>
            <CFormGroup row>
              <CCol md="1">Tên mẫu tiêu chí</CCol>
              <CCol>
                <CInput {...setGetForm("name")} />
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="1">Mô tả</CCol>
              <CCol>
                <CTextarea rows="3" {...setGetForm("description")} />
              </CCol>
            </CFormGroup>
          </fieldset>
        </CForm>
      </CCardHeader>
      <CCardBody className="pl-0 mr-3">
        <Criterion
          criterion={data}
          deep={0}
          edit={edit}
          updateCriterion={setData}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
