import {
  CButton,
  CCard,
  CCardHeader,
  CCol,
  CListGroupItem,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";
import TemplateCard from "./TemplateCard";
import TemplateSearchModal from "./TemplateSearchModal";

const MainComponent = () => {
  const [data, setData] = useState({});
  const [search, setSearch] = useState(false);
  const [currentRole, setCurrentRole] = useState({});

  const getData = () => api.get(`/criterion-roles/template`).then(setData);

  const searchTemplate = (role) => {
    setCurrentRole(role);
    setSearch(true);
  };

  const addTemplate = (template) => {
    setSearch(false);
    api.post(`/criterion-roles`, { ...currentRole, template }).then(getData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mb-3">
      <TemplateSearchModal
        view={search}
        disableView={() => setSearch(false)}
        selected={addTemplate}
      />
      {Object.entries(data).map((entry) => (
        <CCard className="mt-3">
          <CCardHeader color="dark" className="text-white">
            {entry[0] === "thesis" ? "Luận văn" : "Đề cương"}
          </CCardHeader>

          {entry[1]?.map((role) => (
            <CListGroupItem key={role.name} action>
              <CRow>
                <CCol md="2">
                  <strong>{role.name}</strong>
                  <br />
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    onClick={() => searchTemplate(role)}
                  >
                    Thêm mẫu tiêu chí
                  </CButton>
                </CCol>
                <CCol>
                  {role.templates
                    .filter((roleTemplate) => !roleTemplate.deleted)
                    .map((roleTemplate) => (
                      <TemplateCard
                        roleTemplate={roleTemplate}
                        onDeleted={getData}
                      />
                    ))}
                </CCol>
              </CRow>
            </CListGroupItem>
          ))}
        </CCard>
      ))}
    </div>
  );
};

export default MainComponent;
