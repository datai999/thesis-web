import {
  CCreateElement,
  CSidebar,
  CSidebarMinimizer,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarNavTitle,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { permissionFilter } from "src/service/permissionService";
import contextHolder from "./../service/contextService";
// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const [permissionNavigation, setPermissionNavigation] = useState([]);

  useEffect(() => {
    setPermissionNavigation(
      navigation.filter(permissionFilter).map((nav) => {
        nav._children = nav._children?.filter(permissionFilter);
        return nav;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextHolder.user]);

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      {/* <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand> */}
      <CSidebarNav>
        <CCreateElement
          items={permissionNavigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
