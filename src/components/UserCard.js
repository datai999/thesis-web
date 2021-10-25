import CIcon from "@coreui/icons-react";
import { CLink, CTooltip, CWidgetIcon } from "@coreui/react";
import React from "react";

const MainComponent = ({ user, remove }) => {
  const viewDetail = () => {
    // TODO
  };

  if (!user) return null;

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-0"
      header={
        <tr class="d-flex justify-content-between">
          <CTooltip content={`Xem chi tiết thông tin về ${user.lastName}`}>
            <CLink onClick={viewDetail}>
              <td>
                {`${user.degreeName} mã số ${user.code}`}
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
      }
      text={<small>{user.email}</small>}
    >
      <CIcon width={24} name="cil-user" />
    </CWidgetIcon>
  );
};

export default MainComponent;
