import { CButtonGroup, CDataTable, CPagination, CSelect } from "@coreui/react";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";

const MainComponent = ({
  fields,
  items,
  scopedSlots,
  pagination = true,
  selectSemester = false,
  ...props
}) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=(\d+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [semesters, setSemesters] = React.useState([]);
  const [querySemester, setQuerySemester] = React.useState(context.semester);

  const onChangeSemester = (event) => {
    let nextSemester = semesters.find(
      (semester) => semester.id.toString() === event.currentTarget.value
    );
    setQuerySemester(nextSemester);
  };

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`${window.location.pathname}?page=${newPage}`);
    setPage(newPage);
  };

  React.useEffect(() => {
    selectSemester &&
      api.post(`/semesters/example`, { status: "USED" }).then((res) => {
        res.push(context.semester);
        setSemesters(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const currentPath = window.location.pathname;
    if (selectSemester && currentPath.split("/").pop() !== querySemester.name) {
      if (currentPath.match(/\/assign-council\/\d+/)) {
        history.push(
          `${currentPath.match(/(\/[a-z-]+)+\/\d+/)[0]}/${querySemester.name}`
        );
      } else {
        history.push(
          `${currentPath.match(/(\/[a-z-]+)+/)[0]}/${querySemester.name}`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySemester]);

  return (
    <>
      {selectSemester && (
        <div
          style={{
            position: "absolute",
            marginLeft: 300,
            zIndex: 1,
            paddingTop: props.semesterTop ?? 0,
          }}
        >
          <tr style={{ position: "absolute", width: 300 }}>
            <td style={{ paddingRight: 10 }}>Học kỳ</td>
            <td>
              <CSelect onChange={onChangeSemester}>
                {semesters.map((e) => (
                  <option
                    id={e.id}
                    value={e.id}
                    selected={e.id?.toString() === querySemester.id?.toString()}
                  >
                    {e.name}
                  </option>
                ))}
              </CSelect>
            </td>
          </tr>
        </div>
      )}

      <CDataTable
        size="sm"
        hover
        sorter
        columnFilter
        tableFilter
        itemsPerPageSelect
        itemsPerPage={5}
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
