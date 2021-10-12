import CIcon from "@coreui/icons-react";
import { CButton, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TopicTableWithDetail from "src/components/TopicTableWithDetail";
import api from "src/service/api";

const MainComponent = () => {
  const history = useHistory();
  const [data, setData] = useState([]);

  const getData = async () => {
    const userId = await window.localStorage.getItem("userId");
    api
      .get(`/topics/user`, {
        params: {
          userId: userId,
          topicRole: "GUIDE_TEACHER",
          direction: "DESC",
        },
      })
      .then(setData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <TopicTableWithDetail
      items={data}
      ActionComponent={({ item }) => (
        <CTooltip content={"Chỉnh sửa"}>
          <CButton
            color="primary"
            variant="outline"
            onClick={() => {
              history.push("/my/topics/edit", item);
            }}
          >
            <CIcon name="cil-pencil" />
          </CButton>
        </CTooltip>
      )}
    />
  );
};

export default MainComponent;
