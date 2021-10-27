import CIcon from "@coreui/icons-react";
import { CButton, CButtonGroup, CCol, CRow, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TopicLineDetail from "src/components/TopicLineDetail";
import TopicTableWithDetail from "src/components/TopicTableWithDetail";
import api from "src/service/api";
import toastHolder from "src/service/toastService";

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

  return <TopicTableWithDetail items={data} DetailComponent={ExtendDetail} />;
};

const ExtendDetail = ({ item, ...props }) => {
  const history = useHistory();

  const viewCouncilDetail = (council) => {
    if (council?.id) {
      history.push(`/councils/detail/${council?.id}`);
    } else {
      toastHolder.warning("Đề tài không có hội đồng");
    }
  };

  return (
    <CRow className="m-0 p-0">
      <CCol className="m-0 p-0">
        <TopicLineDetail item={item} {...props} />
      </CCol>
      <td className="r-5">
        <CButtonGroup vertical size="sm">
          <CTooltip content={"Hội đồng"}>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => viewCouncilDetail(item.council)}
            >
              <CIcon name="cil-people" />
            </CButton>
          </CTooltip>
          <CTooltip content={"Bảng điểm"}>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => {
                history.push(`/score/topic/${item.id}`);
              }}
            >
              <CIcon name="cil-calculator" />
            </CButton>
          </CTooltip>
        </CButtonGroup>
      </td>
    </CRow>
  );
};

export default MainComponent;
