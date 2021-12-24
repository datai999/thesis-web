import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "src/components/BaseTable";
import toastHolder from "src/service/toastService";
import api from "../../service/api";
import ConfirmNextSemesterModal from "./ConfirmNextSemesterModal";
import CreateSemesterModal from "./CreateSemesterModal";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "name", label: "Học kỳ" },
  { key: "status", label: "Trạng thái" },
  {
    key: "registerTopicTime",
    label: "Thời gian đăng ký đề tài",
  },
  {
    key: "topicTime",
    label: "Thời gian làm DCLV",
  },
  {
    key: "thesisTime",
    label: "Thời gian làm luận văn",
  },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
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
        <CButton
          color="primary"
          variant="outline"
          size="sm"
          onClick={editSemester}
        >
          <CIcon name="cil-pencil" />
        </CButton>
      );
    case "USED":
      return (
        <CDropdown variant="btn-group">
          <CDropdownToggle color="primary" variant="outline"></CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={setCurrentSemester}>
              Đặt làm học kỳ hiện tại
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      );
    default:
      return (
        <CDropdown variant="btn-group">
          <CDropdownToggle color="primary" variant="outline"></CDropdownToggle>
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
  const [data, setData] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editSemester, setEditSemester] = useState({});
  const [toggle, refreshToggle] = useState(false);
  const [currentSemesterView, setCurrentSemesterView] = useState(false);
  const [currentSemesterProps, setCurrentSemesterProps] = useState({});

  const refresh = () => refreshToggle(!toggle);

  const deleteSemester = (semester) =>
    api.delete(`/semesters/${semester.id}`).then(() => {
      refresh();
      toastHolder.success("Xoá học kỳ thành công");
    });

  const setCurrentSemester = async (semester) => {
    await setCurrentSemesterProps(semester);
    setCurrentSemesterView(true);
  };

  useEffect(() => {
    api
      .get(`/semesters`, { params: { direction: "DESC" } })
      .then((response) => {
        setData(response);
      });
  }, [toggle]);

  return (
    <CCard>
      <CreateSemesterModal
        view={createModal}
        disableView={() => setCreateModal(false)}
        success={refresh}
        defaultForm={editSemester}
      />
      <ConfirmNextSemesterModal
        view={currentSemesterView}
        disableView={() => setCurrentSemesterView(false)}
        success={refresh}
        semester={currentSemesterProps}
      />
      <CCardHeader>
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
      </CCardHeader>
      <CCardBody>
        <BaseTable
          items={data}
          fields={fields}
          tableProps={{
            striped: true,
            tableFilter: false,
            itemsPerPageSelect: false,
            columnFilter: false,
            sorter: false,
          }}
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
            registerTopicTime: (item) =>
              multiLineTime(item.registerTopicStart, item.registerTopicEnd),
            topicTime: (item) => multiLineTime(item.topicStart, item.topicEnd),
            thesisTime: (item) =>
              multiLineTime(item.thesisStart, item.thesisEnd),
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
      </CCardBody>
    </CCard>
  );
};

const multiLineTime = (from, to) => (
  <td>
    <CRow>
      <CCol md="0" className="ml-3">
        <div>Từ</div>
        <div>Đến</div>
      </CCol>
      <CCol>
        <div>{from?.replace("T", " ")}</div>
        <div>{to?.replace("T", " ")}</div>
      </CCol>
    </CRow>
  </td>
);

export default MainComponent;
