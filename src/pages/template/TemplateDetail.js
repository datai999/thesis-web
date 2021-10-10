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
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import toastHolder from "src/service/toastService";
import Criterion from "./Criterion";

const MainComponent = () => {
  const history = useHistory();
  const templateIdPath = useLocation().pathname.match(
    /templates\/([0-9]+)/,
    ""
  );
  const [data, setData] = useState({ children: [] });
  const [edit, setEdit] = useState(false);
  const [toggle, setToggle] = useState(false);

  const submit = () => {
    if (templateIdPath)
      api.patch(`/criterions`, data).then((response) => {
        toastHolder.success(
          `Cập nhật mẫu tiêu chí số ${response.id} thành công`
        );
        setData(response);
        setEdit(false);
      });
    else
      api.post(`/criterions`, data).then((response) => {
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

  useEffect(() => {
    templateIdPath &&
      api.get(`/templates/detail/${templateIdPath[1]}`).then((res) => {
        setData(res);
      });
  }, [toggle]);

  console.log(edit);

  return (
    <CCard>
      <CCardHeader>
        <CForm>
          <CRow>
            <CCol className="mt-2 mb-2">
              <h5>
                <center>
                  <strong>
                    {templateIdPath
                      ? `Mẫu tiêu chí số ${data.id}`
                      : "Tạo mẫu tiêu chí"}
                  </strong>
                </center>
              </h5>
            </CCol>
            <CCol md="0">
              {edit ? (
                <>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      setEdit(false);
                      setToggle(!toggle);
                    }}
                  >
                    <CIcon name="cil-x" /> Hủy
                  </CButton>
                  <CButton color="primary" variant="outline" onClick={submit}>
                    <CIcon name="cil-save" /> Lưu
                  </CButton>
                </>
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
          criterion={{ children: data.criterions ?? [] }}
          deep={0}
          edit={edit}
          updateCriterion={(nextCriterion) => {
            const nextData = { ...data, criterions: nextCriterion.children };
            setData(nextData);
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
