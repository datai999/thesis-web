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

const MainComponent = ({ settingTemplate, onDeleted }) => {
  const viewTemplate = () =>
    window.open(
      `${window.location.origin}/templates/${settingTemplate.templateId}`,
      "_blank"
    );

  const removeTemplate = () => {
    api
      .delete(`/setting-templates/logic/${settingTemplate.id}`)
      .then(onDeleted);
  };

  return (
    <CWidgetIcon
      color="info"
      iconPadding={false}
      className="mb-2 mx-0 px-0"
      header={
        <tr class="d-flex justify-content-between">
          <td>
            <CTooltip
              content={`Xem chi tiết mẫu tiêu chí số ${settingTemplate.templateId}`}
            >
              <CLink onClick={viewTemplate}>{`${settingTemplate.name}`}</CLink>
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
          settingTemplate.description.slice(0, 300) +
          (settingTemplate.description.length > 300 ? "..." : "")
        }`}</small>
      }
    >
      {settingTemplate.templateId}
    </CWidgetIcon>
  );
};

export default MainComponent;
