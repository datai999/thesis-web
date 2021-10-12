import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCollapse,
  CDataTable,
  CPagination,
  CTooltip
} from "@coreui/react";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const MainComponent = ({
  fields,
  items,
  scopedSlots,
  DetailComponent,
  pagination = true,
  ...props
}) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [details, setDetails] = useState([]);

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`${window.location.pathname}?page=${newPage}`);
    setPage(newPage);
  };

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

  console.log(props);

  return (
    <>
      <CDataTable
        size="sm"
        hover
        sorter
        columnFilter
        tableFilter
        itemsPerPageSelect
        itemsPerPage={props.size ?? 5}
        // clickableRows
        {...props.tableProps}
        fields={fields}
        items={items}
        activePage={page}
        scopedSlots={{
          actions: (item, index) => (
            <CButtonGroup vertical size="sm">
              {props?.ActionComponent && (
                <props.ActionComponent item={item} index={index} />
              )}
              <CTooltip
                content={details.includes(index) ? "Ẩn bớt" : "Chi tiết"}
              >
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
            </CButtonGroup>
          ),
          details: (item, index) => (
            <CCollapse show={details.includes(index)}>
              <DetailComponent item={item} index={index} />
            </CCollapse>
          ),
          ...scopedSlots,
        }}
      />
      {pagination && (
        <CPagination
          size="sm"
          activePage={page}
          onActivePageChange={pageChange}
          align="center"
        />
      )}
    </>
  );
};

export default MainComponent;
