import { CLink, CTooltip, CWidgetIcon } from "@coreui/react";
import React from "react";

const MainComponent = ({ council = {} }) => {
  const viewDetail = () => {
    // TODO
  };

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-0"
      header={
        <CTooltip content={`Xem chi tiết hội đồng mã số ${council.id}`}>
          <CLink onClick={viewDetail}>
            {`${council.subjectDepartmentName}`}
            <br />
            {`${council.reserveDate}: ${council.startTime} - ${council.endTime}`}
          </CLink>
        </CTooltip>
      }
      text={
        council.location && (
          <small>{`${
            council.location.slice(0, 300) +
            (council.location.length > 300 ? "..." : "")
          }`}</small>
        )
      }
    >
      {council.id}
    </CWidgetIcon>
  );
};

export default MainComponent;
