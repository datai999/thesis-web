import CIcon from "@coreui/icons-react";
import { CLink, CTooltip, CWidgetIcon } from "@coreui/react";
import React from "react";
import viewUserModal from "src/components/user/UserModal";

const MainComponent = ({ user, remove }) => {
  if (!user) return null;

  return (
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
              <CTooltip content={"Xóa"}>
                <CLink
                  style={{ right: 5, position: "absolute" }}
                  onClick={remove}
                >
                  <CIcon name="cil-x-circle" />
                </CLink>
              </CTooltip>
            )}
          </tr>
          <small>{user.email}</small>
        </div>
      }
    >
      <CIcon width={24} name="cil-user" />
    </CWidgetIcon>
  );
};

export default MainComponent;
