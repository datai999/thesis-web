import CIcon from "@coreui/icons-react";
import { CTooltip } from "@coreui/react";
import React from "react";

const MainComponent = (arrayUser) => {
  return (
    <td>
      {arrayUser?.map((user) => (
        <div>
          {user.code} {user.firstName} {user.lastName}{" "}
          <CTooltip content={user.email}>
            <CIcon name="cil-envelope-closed" className="mb-2" />
          </CTooltip>
        </div>
      ))}
    </td>
  );
};

export default MainComponent;
