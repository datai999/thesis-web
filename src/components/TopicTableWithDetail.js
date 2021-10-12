import React from "react";
import TableWithDetail from "./TableWithDetail";
import TopicLineDetail from "./TopicLineDetail";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "names", label: "Tên đề tài" },
  { key: "semester", label: "Học kỳ", _style: { width: 1 } },
  { key: "type", label: "Loại", _style: { width: 1 } },
  {
    key: "educationMethodNames",
    label: "Phương thức",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Ngành", _style: { width: "12%" } },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];

const MainComponent = ({ items, ActionComponent }) => {
  return (
    <TableWithDetail
      fields={fields}
      items={items}
      DetailComponent={TopicLineDetail}
      scopedSlots={{
        names: (item) => multiLine(item.names),
        educationMethodNames: (item) => multiLine(item.educationMethodNames),
        majorNames: (item) => multiLine(item.majorNames),
      }}
      ActionComponent={ActionComponent}
    />
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div key={e}>{e}</div>)}</td>
);

export default MainComponent;
