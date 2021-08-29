import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../service/api";

const fields = [
  "id",
  "name",
  "thesis",
  "semester",
  "educationMethod",
  "majors",
  "description",
];

const Topics = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [topics, setTopics] = useState([]);

  const fetchTopics = async (number) => {
    var response = await api.getPaging(
      { number: number - 1, size: 5 },
      "/topic"
    );
    await setTopics(response.content);
    return response.content;
  };

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/topics?page=${newPage}`);
  };

  useEffect(() => {
    fetchTopics(page);
  }, []);

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    fetchTopics(currentPage);
  }, [currentPage, page]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" className="card-title mb-0">
              Đề tài
            </h4>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => history.push(`/topics/create`)}
            >
              Thêm đề tài
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={topics}
          fields={fields}
          hover
          striped
          itemsPerPage={5}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/topics/${item.id}`)}
          scopedSlots={{
            name: (item) => (
              <td>
                <tr>
                  <CBadge>{item.name?.vi}</CBadge>
                </tr>
                <tr>
                  <CBadge>{item.name?.en}</CBadge>
                </tr>
              </td>
            ),
            educationMethod: (item) => {
              return (
                <td>
                  <CBadge>{item.educationMethod.value?.vi}</CBadge>
                </td>
              );
            },
            majors: (item) => (
              <td>
                {item.majors.map((major) => (
                  <tr>
                    <CBadge>{major.name?.vi}</CBadge>
                  </tr>
                ))}
              </td>
            ),
          }}
        />
        <CPagination
          activePage={page}
          onActivePageChange={pageChange}
          align="center"
        />
      </CCardBody>
    </CCard>
  );
};

export default Topics;
