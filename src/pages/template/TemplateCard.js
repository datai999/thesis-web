import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CLink,
  CTooltip,
  CWidgetIcon
} from "@coreui/react";
import React from "react";
import api from "src/service/api";

const MainComponent = ({ template, onDeleted }) => {
  const viewTemplate = () =>
    window.open(`${window.location.origin}/templates/${template.id}`, "_blank");

  const removeTemplate = () => {
    api.delete(`/criterion-roles/logic/${template.id}`).then(onDeleted);
  };

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-2 mx-0 px-0"
      header={
        <tr class="d-flex justify-content-between">
          <td>
            <CTooltip content={`Xem chi tiết mẫu tiêu chí số ${template.id}`}>
              <CLink onClick={viewTemplate}>{`${template.name}`}</CLink>
            </CTooltip>
          </td>
          <td>
            <CDropdown style={{ top: 2, right: 5, position: "absolute" }}>
              <CDropdownToggle
                size="sm"
                color="dark"
                variant="outline"
              ></CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={viewTemplate}>
                  Xem chi tiết
                </CDropdownItem>
                <CDropdownItem onClick={removeTemplate}>
                  Xóa mẫu tiêu chí
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </td>
        </tr>
      }
      text={
        <small>{`${
          template.description.slice(0, 300) +
          (template.description.length > 300 ? "..." : "")
        }`}</small>
      }
    >
      {template.id}
    </CWidgetIcon>
  );
};

export default MainComponent;
