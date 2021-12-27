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
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import toastHolder from "src/service/toastService";
import api from "../../service/api";
import ConfirmNextSemesterModal from "./ConfirmNextSemesterModal";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "name", label: "Học kỳ" },
  { key: "status", label: "Trạng thái" },
  { key: "type", label: "Loại đề tài" },
  {
    key: "createTopic",
    label: "Ra đề tài",
  },
  {
    key: "registerTopic",
    label: "Đăng ký đề tài",
  },
  {
    key: "midMark",
    label: "Đánh giá giữa kỳ",
  },
  {
    key: "defaultMidMark",
    label: "Kết quả giữa kỳ ban đầu",
    _style: { width: 80 },
  },
  {
    key: "executeTopic",
    label: "Hiên thực",
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
            <CDropdownItem onClick={editSemester}>Xem thông tin</CDropdownItem>
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
  const history = useHistory();
  const [data, setData] = useState([]);
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
                history.push(`/semesters/create`);
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
            type: () => (
              <td>
                <div className="border-bottom">
                  <div>Đề cương</div>
                  <br />
                </div>
                <div>
                  <div>Luận văn</div>
                  <br />
                </div>
              </td>
            ),
            createTopic: (item) => multiLineTime(item, "createTopic"),
            registerTopic: (item) => multiLineTime(item, "registerTopic"),
            midMark: (item) => multiLineTime(item, "midMark"),
            defaultMidMark: (item) => (
              <td>
                <div className="border-bottom">
                  <div>{item.outline?.defaultMid ? "Đạt" : "Không đạt"}</div>
                  <br />
                </div>
                <div>
                  <div>{item.thesis?.defaultMid ? "Đạt" : "Không đạt"}</div>
                  <br />
                </div>
              </td>
            ),
            executeTopic: (item) => multiLineTime(item, "executeTopic"),
            actions: (item) => (
              <td>
                {getAction(
                  item,
                  () => {
                    history.push(`/semesters/${item.id}`);
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

const multiLineTime = (item, property) => {
  const outline = item.outline ?? {};
  const thesis = item.thesis ?? {};

  return (
    <td>
      <div className="border-bottom">
        <div>{outline[`${property}Start`]?.replace("T", " ") || <br />}</div>
        <div>
          {outline[`${property}End`] && `->`}
          {outline[`${property}End`]?.replace("T", " ") || <br />}
        </div>
      </div>
      <div>
        <div>{thesis[`${property}Start`]?.replace("T", " ") || <br />}</div>
        <div>
          {thesis[`${property}End`] && `->`}
          {thesis[`${property}End`]?.replace("T", " ") || <br />}
        </div>
      </div>
    </td>
  );
};

export default MainComponent;
