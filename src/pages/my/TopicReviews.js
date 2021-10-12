import React, { useEffect, useState } from "react";
import TopicTableWithDetail from "src/components/TopicTableWithDetail";
import api from "src/service/api";

const MainComponent = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const userId = await window.localStorage.getItem("userId");
    api
      .get(`/topics/user`, {
        params: {
          userId: userId,
          topicRole: "REVIEW_TEACHER",
          direction: "DESC",
        },
      })
      .then(setData);
  };

  useEffect(() => {
    getData();
  }, []);

  return <TopicTableWithDetail items={data} />;
};

export default MainComponent;
