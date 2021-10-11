import { CLink, CTooltip, CWidgetIcon } from "@coreui/react";
import React from "react";

const MainComponent = ({ user }) => {
  const viewDetail = () => {
    // TODO
  };

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-0"
      header={
        <CTooltip content={`Xem chi tiết thông tin về ${user.lastName}`}>
          <CLink onClick={viewDetail}>
            {user.degreeName} {user.firstName} {user.lastName}
          </CLink>
        </CTooltip>
      }
      text={
        <small>
          {user.code}
          <br />
          {user.email}
        </small>
      }
    >
      {user.code}
    </CWidgetIcon>
  );
};

export default MainComponent;
