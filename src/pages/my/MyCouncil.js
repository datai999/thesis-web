import CIcon from "@coreui/icons-react";
import { CCardBody, CDataTable, CTooltip } from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import TableWithDetail from "src/components/TableWithDetail";
import TopicTableWithDetail from "src/components/TopicTableWithDetail";
import api from "src/service/api";
import contextHolder from "src/service/contextService";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "semesterName", label: "Học kỳ", _style: { width: 90 } },
  { key: "time", label: "Thời gian", _style: { width: 140 } },
  { key: "location", label: "Địa điểm", _style: { width: "15%" } },
  { key: "members", label: "Thành viên", sorter: false },
  { key: "note", label: "Ghi chú" },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];
const councilRoleFields = [
  { key: "role", label: "Vai trò" },
  { key: "code", label: "Mã số" },
  { key: "degree", label: "Học vị" },
  { key: "name", label: "Họ tên và email" },
];

const MainComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get(`/council-members/member`, {
        params: {
          memberId: contextHolder.user.id,
          direction: "DESC",
        },
      })
      .then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicTableProps = {
    tableFilter: false,
    itemsPerPage: 100,
    itemsPerPageSelect: false,
    columnFilter: false,
  };

  const renderDetail = ({ item }) => {
    return (
      <CCardBody>
        <TopicTableWithDetail
          items={item.topics}
          tableProps={topicTableProps}
          pagination={false}
        />
      </CCardBody>
    );
  };

  return (
    <TableWithDetail
      fields={fields}
      items={data}
      DetailComponent={renderDetail}
      scopedSlots={{
        time: (item) => (
          <td>
            <div>
              {"Ngày"}
              <div className="float-right">{item.reserveDate}</div>
            </div>
            <div>
              {"Bắt đầu"}
              <div className="float-right">{item.startTime}</div>
            </div>
            <div>
              {"Kết thúc"}
              <div className="float-right">{item.endTime}</div>
            </div>
          </td>
        ),
        members: (item) => (
          <td className="p-0">
            {
              <CDataTable
                items={Object.entries(
                  _.groupBy(item.members, (e) => e.role.name)
                ).sort(
                  (a, b) =>
                    a[1][0].role.displayOrder - b[1][0].role.displayOrder
                )}
                fields={councilRoleFields}
                size="sm"
                scopedSlots={{
                  role: (row) => <>{row[0]}</>,
                  code: (row) =>
                    multiLine(
                      row[1].map((councilMember) => councilMember.member.code)
                    ),
                  degree: (row) =>
                    multiLine(
                      row[1].map(
                        (councilMember) => councilMember.member.degreeName
                      )
                    ),
                  name: (row) =>
                    multiLine(
                      row[1]
                        .map((councilMember) => councilMember.member)
                        .map((user) => (
                          <div>
                            {user.firstName} {user.lastName}{" "}
                            <CTooltip content={user.email}>
                              <CIcon
                                name="cil-envelope-closed"
                                className="mb-2"
                              />
                            </CTooltip>
                          </div>
                        ))
                    ),
                }}
              />
            }
          </td>
        ),
      }}
    />
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;