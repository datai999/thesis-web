import CIcon from "@coreui/icons-react";
import {
  CButton,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
  CWidgetIcon,
} from "@coreui/react";
import React from "react";
import viewUserModal from "src/components/user/UserModal";

const MainComponent = ({ user, remove }) => {
  const [confirmRemove, setConfirmRemove] = React.useState(false);

  if (!user) return null;

  return (
    <>
      <ConfirmRemove
        view={confirmRemove}
        disableView={() => setConfirmRemove(false)}
        confirm={remove}
        user={user}
      />
      <CWidgetIcon
        color="dark"
        iconPadding={false}
        className="mb-0"
        header={
          <div className="text-dark">
            <tr class="d-flex justify-content-between">
              <CTooltip content={`Xem chi tiết thông tin về ${user.lastName}`}>
                <CLink onClick={() => viewUserModal(user)}>
                  <td>
                    {`${user.degreeName ?? "Sinh viên"} mã số ${user.code}`}
                    <br />
                    {`${user.firstName} ${user.lastName}`}
                  </td>
                </CLink>
              </CTooltip>
              {remove && (
                <CTooltip color="danger" content={"Xóa"}>
                  <CButton
                    style={{ right: 5, position: "absolute" }}
                    onClick={() => setConfirmRemove(true)}
                    color="danger"
                    variant="ghost"
                    className="p-0"
                  >
                    <CIcon color="danger" name="cil-x-circle" />
                  </CButton>
                </CTooltip>
              )}
            </tr>
            <small>{user.email}</small>
          </div>
        }
      >
        <CIcon width={24} name="cil-user" />
      </CWidgetIcon>
    </>
  );
};

const ConfirmRemove = ({ view, disableView, ...props }) => {
  const user = props.user ?? {};

  const confirm = () => {
    disableView();
    props.confirm();
  };

  return (
    <CModal size="sm" color="warning" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Cảnh báo loại bỏ</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <strong>{`Mã số ${user.code}: ${user.fullName}`}</strong>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={confirm}>
          Xác nhận
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
