import CIcon from "@coreui/icons-react";
import {
  CBreadcrumbRouter,
  CHeader,
  CHeaderNav,
  CLink,
  CToggler
} from "@coreui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// routes config
import routes from "../routes";
import ActionUserModal from "./ActionUserModal";
import {
  Notification,
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
} from "./index";

const TheHeader = ({ refreshPage }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [actionUserModal, setActionUserModal] = React.useState(false);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />

      <CBreadcrumbRouter
        className="border-0 c-subheader-nav mr-auto px-0 px-md-3"
        routes={routes}
      />

      <CHeaderNav className="px-3">
        <ActionUserModal
          view={actionUserModal}
          disableView={() => {
            history.go(0);
          }}
        />
        <CLink onClick={() => setActionUserModal(true)}>
          <CIcon name="cil-user" className="mfe-2" />
        </CLink>
        <TheHeaderDropdownNotif />
        <TheHeaderDropdownTasks />
        <TheHeaderDropdownMssg />
        <Notification />
        <TheHeaderDropdown />
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
