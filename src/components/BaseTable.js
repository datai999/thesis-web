import { CButtonGroup, CDataTable, CPagination } from "@coreui/react";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const MainComponent = ({
  fields,
  items,
  scopedSlots,
  pagination = true,
  ...props
}) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=(\d+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`${window.location.pathname}?page=${newPage}`);
    setPage(newPage);
  };

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
            </CButtonGroup>
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
