import CIcon from "@coreui/icons-react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CLink,
} from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import contextHolder from "src/service/contextService";

const MainComponent = () => {
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);

  const logout = async () => {
    setLoading(true);
    await window.localStorage.clear();
    setLoading(false);
    history.push("/login");
  };

  if (loading) throw new Promise(() => {});
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false} size="sm">
        <CLink>
          <h5>
            <strong>{contextHolder.user?.fullName}</strong>
          </h5>
        </CLink>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          onClick={() => history.push(`/users/${contextHolder.user.id}`)}
        >
          <CIcon name="cil-user" className="mfe-2" />
          Trang cá nhân
        </CDropdownItem>
        <CDropdownItem onClick={logout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default MainComponent;
