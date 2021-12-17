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
import viewUserModal from "src/components/user/UserModal";
import api from "src/service/api";

const limitMessage = 20;
const scheduleMilliseconds = 5 * 5000;

const idTagRegex = /\d+(?=( >))/;
const hrefTagRegex = /\/.+(?=(" >))/;
const innerTagRegex = /(?<=>).*(?=<)/;
const userTag = {
  regex: /<user id=\d* >[^<]*<\/user>/g,
  onClick: (tag) => viewUserModal({ id: tag.match(idTagRegex)[0] }),
};
const topicTag = {
  regex: /<topic id=\d* >[^<]*<\/topic>/g,
  onClick: (tag) =>
    window
      .open(
        `${window.location.origin}/topics/${tag.match(idTagRegex)[0]}`,
        "_blank"
      )
      .focus(),
};
const newTabTag = {
  regex: /<newTab href=[^>]* >[^<]*<\/newTab>/g,
  onClick: (tag) => {
    console.log(tag);
    window
      .open(`${window.location.origin}${tag.match(hrefTagRegex)[0]}`, "_blank")
      .focus();
  },
};

const toComponent = (message, tagProps) => {
  if (!message) return;

  const tags = [...message.matchAll(tagProps.regex)].map((e) => e[0]);
  const tagResult = tags.map((tag) => (
    <CLink onClick={() => tagProps.onClick(tag)}>
      {tag.match(innerTagRegex)[0]}
    </CLink>
  ));

  let result = [];
  let parts = message.split(tagProps.regex);
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    result.push(tagResult[i]);
  }
  result.pop();

  return result.filter((e) => e !== "");
};

const tagToComponent = (message) => {
  let result = [message];
  [userTag, topicTag, newTabTag].forEach((tag) => {
    result = result
      .map((e) =>
        typeof e === "string" || e instanceof String ? toComponent(e, tag) : e
      )
      .flat();
  });
  return result;
};

const MainComponent = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState([]);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [toggle, refreshToggle] = useState(false);

  const getMessage = () => {
    api
      .get(`/notifications/my`, { params: { limit: limitMessage } })
      .then((response) => {
        setAllMessages(
          response.all.map((e) => {
            return { ...e, arrMessage: tagToComponent(e.message) };
          })
        );
        setUnseenMessages(
          response.unseen.map((e) => {
            return { ...e, arrMessage: tagToComponent(e.message) };
          })
        );
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

              {message.arrMessage.map((e) =>
                typeof e === "string" || e instanceof String ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: e }}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                ) : (
                  <>{e} </>
                )
              )}
            </CDropdownItem>
          ))}
        </div>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default MainComponent;
