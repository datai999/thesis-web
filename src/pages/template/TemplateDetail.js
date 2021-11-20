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
  CSwitch,
  CTextarea,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";
import toastHolder from "src/service/toastService";
import Criterion from "./Criterion";

const MainComponent = () => {
  const canEdit = loginUserHasAny([PERMISSIONS.EDUCATION_STAFF]);

  const history = useHistory();
  const templateIdPath = useLocation().pathname.match(
    /templates\/([0-9]+)/,
    ""
  );
  const [data, setData] = useState({});
  const [edit, setEdit] = useState(templateIdPath ? false : true);
  const [review, setReview] = useState(false);

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

  useEffect(() => {
    templateIdPath &&
      api.get(`/templates/detail/${templateIdPath[1]}`).then((res) => {
        setData(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader className="mx-3">
        <CForm>
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

          <CFormGroup row>
            <strong>Sử dụng thang điểm số</strong>
            <CSwitch
              color="primary"
              labelOn={"\u2713"}
              labelOff={"\u2715"}
              className="ml-3"
              defaultChecked={data.numberMark}
              disabled={!edit}
              onChange={(e) =>
                setValueForm("numberMark", e.currentTarget.checked)
              }
            />
          </CFormGroup>
          {edit ? (
            <CFormGroup row>
              <strong>Mô tả</strong>
              <CTextarea rows="3" {...setGetForm("description")} />
            </CFormGroup>
          ) : (
            <CRow>
              <CCol md="0">
                <strong>Mô tả</strong>
              </CCol>
              <CCol>{data.description}</CCol>
            </CRow>
          )}
        </CForm>
      </CCardHeader>
      <CCardBody className="pl-0 mr-3">
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
    </CCard>
  );
};

export default MainComponent;
