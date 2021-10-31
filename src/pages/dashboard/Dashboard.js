import { CCard, CCol, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import api from "src/service/api";
import contextHolder from "src/service/contextService";

const MainComponent = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  const handleData = (currentSemester) => {
    const baseItems = [
      {
        title: currentSemester.registerTopicStart,
        cardTitle: "Bắt đầu đăng ký đề tài",
        cardDetailedText: "Sinh viên bắt đầu đăng ký đề tài",
      },
      {
        title: currentSemester.registerTopicEnd,
        cardTitle: "Kết thúc đăng ký đề tài",
        cardDetailedText:
          "Kết thúc thời gian cho phép sinh viên đăng ký đề tài",
      },
      {
        title: currentSemester.topicStart,
        cardTitle: "Bắt đầu hiện thực đề cương",
        cardDetailedText: "Sinh viên bắt đầu hiện thực đề cương",
      },
      {
        title: currentSemester.topicEnd,
        cardTitle: "Kết thúc hiện thực đề cương",
        cardDetailedText: "Sinh viên kết thúc hiện thực đề cương",
      },
      {
        title: currentSemester.thesisStart,
        cardTitle: "Bắt đầu hiện thực luận văn",
        cardDetailedText: "Sinh viên bắt đầu hiện thực luận văn",
      },
      {
        title: currentSemester.thesisEnd,
        cardTitle: "Kết thúc hiện thực luận văn",
        cardDetailedText: "Sinh viên kết thúc hiện thực luận văn",
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
        e.title = <small>{e.title}</small>;
        return e;
      });

    setData(items);
  };

  useEffect(() => {
    api.get(`/semesters/current`).then(handleData);
  }, []);

  useEffect(() => {
    var timerID = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerID);
  });

  return (
    <CCard>
      <CRow>
        <CCol className="mt-3 mt-md-5">
          <h3 class="d-flex justify-content-center">
            Xin chào,<strong> {contextHolder.user?.fullName}</strong>
          </h3>
          <h4 class="d-flex justify-content-center">{date.toLocaleString()}</h4>
        </CCol>
        <CCol md="6">
          <Chrono
            items={data}
            mode="VERTICAL"
            slideShow
            disableNavOnKey
            hideControls
            allowDynamicUpdate={true}
            useReadMore={false}
            cardHeight={1}
            flipLayout={false}
          />
        </CCol>
      </CRow>
    </CCard>
  );
};

export default MainComponent;
