import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCardFooter } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import toastHolder from "src/service/toastService";

const MainComponent = () => {
  const history = useHistory();
  const templateIdPath = useLocation().pathname.match(
    /templates\/([0-9]+)/,
    ""
  );
  const [data, setData] = useState({ children: [] });
  const [edit, setEdit] = useState(templateIdPath ? false : true);

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

  useEffect(() => {
    templateIdPath &&
      api.get(`/criterions/detail/${templateIdPath[1]}`).then((res) => {
        setData(res);
      });
  }, []);

  return (
    <CCard>
      <CCardBody></CCardBody>
      <CCardFooter>
        <CButton type="submit" color="primary" size="sm" onClick={submit}>
          <CIcon name="cil-save" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default MainComponent;
