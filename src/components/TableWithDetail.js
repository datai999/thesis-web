import CIcon from "@coreui/icons-react";
import { CButton, CCollapse, CTooltip } from "@coreui/react";
import React, { useState } from "react";
import BaseTable from "./BaseTable";

const MainComponent = ({
  fields,
  items,
  scopedSlots,
  DetailComponent,
  ...props
}) => {
  const [details, setDetails] = useState([]);

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  return (
    <BaseTable
      fields={fields}
      items={items}
      {...props.tableProps}
      ActionComponent={({ item, index }) => (
        <>
          {props?.ActionComponent && (
            <props.ActionComponent item={item} index={index} />
          )}
          <CTooltip content={details.includes(index) ? "Ẩn bớt" : "Chi tiết"}>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => {
                toggleDetails(index);
              }}
            >
              <CIcon
                name={`cil-chevron-${
                  details.includes(index) ? "top" : "bottom"
                }`}
              />
            </CButton>
          </CTooltip>
        </>
      )}
      scopedSlots={{
        details: (item, index) => (
          <CCollapse show={details.includes(index)}>
            <DetailComponent item={item} index={index} />
          </CCollapse>
        ),
        ...scopedSlots,
      }}
    />
  );
};

export default MainComponent;
