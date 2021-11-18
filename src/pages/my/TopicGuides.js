import CIcon from "@coreui/icons-react";
import { CButton, CButtonGroup, CCol, CRow, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TopicLineDetail from "src/components/TopicLineDetail";
import TopicTableWithDetail from "src/components/TopicTableWithDetail";
import api from "src/service/api";
import context from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = () => {
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = useState([]);

  const getData = async () => {
    api
      .get(`/guide-teachers/${context.user.id}/topics`, {
        params: {
          semesterName,
        },
      })
      .then(setData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

  return (
    <>
      <TopicTableWithDetail
        items={data}
        DetailComponent={ExtendDetail}
        tableProps={{ selectSemester: true }}
      />
    </>
  );
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
