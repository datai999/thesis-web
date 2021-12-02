import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CLink,
  CRow,
  CSwitch,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";

const limitMessage = 20;
const scheduleMilliseconds = 100 * 5000;

const MainComponent = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState([]);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [toggle, refreshToggle] = useState(false);

  const getMessage = () => {
    api
      .get(`/notifications/my`, { params: { limit: limitMessage } })
      .then((response) => {
        setAllMessages(response.all);
        setUnseenMessages(response.unseen);
      });
  };

  const seen = (message) =>
    api
      .put(`/notifications/seen/${message.id}`)
      .then(() => refreshToggle(!toggle));

  useEffect(() => {
    getMessage();
    setInterval(getMessage, scheduleMilliseconds);
  }, []);

  useEffect(() => {
    getMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  return (
    <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell" />
        <CBadge shape="pill" color="danger">
          {unseenMessages?.length > 0
            ? unseenMessages?.length >= limitMessage
              ? `${unseenMessages?.length}+`
              : unseenMessages?.length
            : null}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 w-10 " placement="bottom-end">
        <CRow className="pt-3 ml-3">
          <CCol md="0">Chỉ xem tin nhắn chưa đọc</CCol>
          <CCol>
            <CSwitch
              color="primary"
              labelOn={"\u2713"}
              labelOff={"\u2715"}
              defaultChecked={unseenOnly}
              onChange={(e) => setUnseenOnly(e.currentTarget.checked)}
            />
          </CCol>
        </CRow>

        <div
          class="overflow-auto"
          style={{ maxHeight: 500, maxWidth: 300, minWidth: 300 }}
        >
          {(unseenOnly ? unseenMessages : allMessages).map((message, index) => (
            <CDropdownItem
              key={index}
              className={`border-top ${message.seen ? "" : "bg-light"}`}
              header
            >
              <div>
                <small>
                  {message.createdAt.replace("T", " ").substring(0, 16)}
                </small>
                {!message.seen && (
                  <CLink href="#" onClick={() => seen(message)}>
                    <small className="float-right">Đánh dấu đã xem</small>
                  </CLink>
                )}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: message.message }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </CDropdownItem>
          ))}
        </div>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default MainComponent;
