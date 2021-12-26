import {
  CCard,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabs,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import api from "src/service/api";
import contextHolder from "src/service/contextService";

const MainComponent = () => {
  const [date, setDate] = useState(new Date());
  const [current, setCurrent] = React.useState({});
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    api.get(`/semesters/current`).then((semester) => {
      setCurrent(semester);
    });
    var timerID = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  return (
    <CCard>
      <CRow>
        <CCol className="mt-3 mt-md-5">
          <h3 class="d-flex justify-content-center">
            Xin chào,<strong> {contextHolder.user?.fullName}</strong>
          </h3>
          <h4 class="d-flex justify-content-center">{date.toLocaleString()}</h4>
        </CCol>

        <CCol
          md="6"
          style={{ height: window.screen.height * 0.73, paddingTop: 15 }}
        >
          <CTabs activeTab={activeTab} onActiveTabChange={setActiveTab}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>Đề cương</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>Luận văn</CNavLink>
              </CNavItem>
            </CNav>
          </CTabs>
          <div style={{ height: window.screen.height * 0.65 }}>
            <Timeline
              semesterTimeLine={current[activeTab < 1 ? "outline" : "thesis"]}
            />
          </div>
        </CCol>
      </CRow>
    </CCard>
  );
};

const Timeline = ({ semesterTimeLine = {} }) => {
  const baseItems = [
    {
      title: semesterTimeLine.createTopicStart,
      cardTitle: "Giáo viên bắt đầu ra đề tài",
      cardDetailedText: "Bắt đầu thời gian cho phép giáo viên ra đề tài",
    },
    {
      title: semesterTimeLine.createTopicEnd,
      cardTitle: "Kết thúc ra đề tài",
      cardDetailedText: "Kết thúc thời gian cho phép giáo viên ra đề tài",
    },
    {
      title: semesterTimeLine.midMarkStart,
      cardTitle: "Giáo viên bắt đầu đánh giá giữa kỳ",
      cardDetailedText:
        "Bắt đầu thời gian cho phép giáo viên đánh giá kết quả giữa kỳ",
    },
    {
      title: semesterTimeLine.midMarkEnd,
      cardTitle: "Kết thúc đánh giá giữa kỳ",
      cardDetailedText:
        "Kết thúc thời gian cho phép giáo viên đánh giá kết quả giữa kỳ",
    },
    {
      title: semesterTimeLine.registerTopicStart,
      cardTitle: "Sinh viên bắt đầu đăng ký đề tài",
      cardDetailedText: "Sinh viên bắt đầu đăng ký đề tài",
    },
    {
      title: semesterTimeLine.registerTopicEnd,
      cardTitle: "Kết thúc đăng ký đề tài",
      cardDetailedText: "Kết thúc thời gian cho phép sinh viên đăng ký đề tài",
    },
    {
      type: "outline",
      title: semesterTimeLine.executeTopicStart,
      cardTitle: "Bắt đầu hiện thực đề tài",
      cardDetailedText: "Sinh viên bắt đầu hiện thực đề tài",
    },
    {
      title: semesterTimeLine.executeTopicEnd,
      cardTitle: "Kết thúc hiện thực đề tài",
      cardDetailedText: "Sinh viên kết thúc hiện thực đề tài",
    },
    {
      title: new Date().toLocaleString(),
      cardTitle: "Hiện tại",
    },
  ];

  const items = baseItems
    .sort((a, b) => {
      let dateA = new Date(a.title),
        dateB = new Date(b.title);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    })
    .map((e) => {
      e.title = new Date(e.title)
        .toLocaleString("en-GB")
        .replace(/,/, "")
        .replace(/:\d{2}$/, "");
      return e;
    });

  return (
    <Chrono
      items={items}
      mode="VERTICAL"
      slideShow
      disableNavOnKey
      hideControls
      allowDynamicUpdate={true}
      useReadMore={false}
      cardHeight={1}
      flipLayout={false}
    />
  );
};

export default MainComponent;
