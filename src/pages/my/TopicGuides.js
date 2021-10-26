import CIcon from "@coreui/icons-react";
import { CButton, CButtonGroup, CCol, CRow, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TopicLineDetail from "src/components/TopicLineDetail";
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
          topicRole: "GUIDE_TEACHER",
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

  return (
    <CRow className="m-0 p-0">
      <CCol className="m-0 p-0">
        <TopicLineDetail item={item} {...props} />
      </CCol>
      <td className="r-5">
        <CButtonGroup vertical size="sm">
          <CTooltip content={"Hội đồng"}>
            {/* TODO: Council view */}
            <CButton color="primary" variant="outline">
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
          {/* <CTooltip content={"Xóa đề tài"}>
            <CButton
              color="primary"
              variant="outline"
              // onClick={() => {
              //   setTopicCancel(topic);
              //   setCancelTopicModal(true);
              // }}
            >
              <CIcon name="cil-x-circle" />
            </CButton>
          </CTooltip> */}
        </CButtonGroup>
      </td>
    </CRow>
  );
};

export default MainComponent;
