import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CPagination,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../service/api";
import CreateSemesterModal from "./CreateSemesterModal";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "name", label: "Học kỳ" },
  { key: "status", label: "Trạng thái" },
  {
    key: "registerTopicStartTime",
    label: "Thời gian bắt đầu đăng ký đề tài",
  },
  {
    key: "registerTopicEndTime",
    label: "Thời gian kết thúc đăng ký đề tài",
  },
  {
    key: "actions",
    label: "",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
];

const getBadge = (status) => {
  switch (status) {
    case "USING":
      return "success";
    case "USED":
      return "secondary";
    default:
      return null;
  }
};

const getAction = (
  semester,
  editSemester,
  deleteSemester,
  setCurrentSemester
) => {
  switch (semester.status) {
    case "USING":
      return (
        <CButton color="primary" variant="outline" onClick={editSemester}>
          Chỉnh sửa
        </CButton>
      );
    case "USED":
      return null;
    default:
      return (
        <CDropdown variant="btn-group">
          <CDropdownToggle color="primary" variant="outline">
            Hành động
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={setCurrentSemester}>
              Đặt làm học kỳ hiện tại
            </CDropdownItem>
            <CDropdownItem onClick={editSemester}>Chỉnh sửa</CDropdownItem>
            <CDropdownItem onClick={deleteSemester}>Xóa</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      );
  }
};

const MainComponent = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editSemester, setEditSemester] = useState({});

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/semesters?page=${newPage}`);
    setPage(newPage);
  };

  const deleteSemester = (semester) =>
    api.delete(`/semesters/${semester.id}`).then(() => history.go(0));

  const setCurrentSemester = (semester) =>
    api.put(`/semesters/current?id=${semester.id}`).then(() => history.go(0));

  useEffect(() => {
    api
      .get(`/semesters`, { params: { direction: "DESC" } })
      .then((response) => {
        response.forEach((e) => {
          e.registerTopicStartTime = e.registerTopicStart?.replace("T", " ");
          e.registerTopicEndTime = e.registerTopicEnd?.replace("T", " ");
        });
        setData(response);
      });
  }, [page]);

  return (
    <CCard>
      <CreateSemesterModal
        view={createModal}
        disableView={() => setCreateModal(false)}
        success={() => history.go(0)}
        defaultForm={editSemester}
      />
      <CCardHeader></CCardHeader>
      <CCardBody>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" className="card-title mb-0">
              Danh sách học kỳ
            </h4>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => {
                setEditSemester({});
                setCreateModal(true);
              }}
            >
              Thêm học kỳ mới
            </CButton>
          </CCol>
        </CRow>
        <CDataTable
          items={data}
          fields={fields}
          hover
          activePage={page}
          scopedSlots={{
            status: (item) => (
              <td className="py-2">
                <CBadge color={getBadge(item.status)}>
                  {item.status
                    ? item.status !== "USED"
                      ? "Hiện tại"
                      : "Đã qua"
                    : null}
                </CBadge>
              </td>
            ),
            actions: (item) => (
              <td>
                {getAction(
                  item,
                  () => {
                    setEditSemester(item);
                    setCreateModal(true);
                  },
                  () => deleteSemester(item),
                  () => setCurrentSemester(item)
                )}
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

export default MainComponent;
