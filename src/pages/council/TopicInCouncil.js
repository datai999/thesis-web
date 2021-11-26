import { CPagination } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import TopicModal from "src/pages/topic/TopicModal";
import api from "src/service/api";
import { fields, scopedSlots } from "src/service/topicService";

const MainComponent = ({ councilId, mark }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [topicModal, setTopicModal] = useState(false);
  const [modalProps, setModalProps] = useState({ topic: {} });

  const getData = () => {
    setLoading(true);
    api
      .post(`/topics/example`, {
        council: { id: councilId },
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) throw new Promise(() => {});
  return (
    <>
      <TopicModal
        view={topicModal}
        disableView={() => setTopicModal(false)}
        {...modalProps}
      />
      <BaseTable
        items={data}
        fields={fields}
        scopedSlots={scopedSlots}
        pagination={false}
        tableProps={{
          tableFilter: false,
          itemsPerPageSelect: false,
          activePage: page,
          clickableRows: true,
          onRowClick: (item) => {
            if (mark) {
              history.push(`${window.location.pathname}/${item.id}`);
            } else {
              setModalProps({ topic: item });
              setTopicModal(true);
            }
          },
        }}
      />
      <CPagination
        size="sm"
        align="center"
        activePage={page}
        onActivePageChange={setPage}
      />
    </>
  );
};

export default MainComponent;
