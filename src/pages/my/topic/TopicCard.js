import { CLink, CTooltip, CWidgetIcon } from "@coreui/react";
import React from "react";

const MainComponent = ({ topic }) => {
  const viewDetail = () => {
    // TODO
  };

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-0"
      header={
        <CTooltip content={`Xem chi tiết đề tài mã số ${topic.id}`}>
          <CLink onClick={viewDetail}>
            {`${topic.name?.vi}`}
            <br />
            {`${topic.name?.en}`}
          </CLink>
        </CTooltip>
      }
      text={
        topic.description && (
          <small>{`${
            topic.description.slice(0, 300) +
            (topic.description.length > 300 ? "..." : "")
          }`}</small>
        )
      }
    >
      {topic.id}
    </CWidgetIcon>
  );
};

export default MainComponent;
