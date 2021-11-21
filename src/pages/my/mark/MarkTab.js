import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Criterion from "src/pages/template/Criterion";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({
  templateId,
  topicId,
  studentId,
  disableMark = false,
}) => {
  const scoreExample = {
    topic: { id: topicId },
    teacher: contextHolder.user.id,
    student: studentId,
  };

  const [template, setTemplate] = useState({});
  const [scores, setScores] = useState([]);

  const updateScore = (score) => {
    score = { ...score, ...scoreExample };
    const index = scores.findIndex(
      (e) => e.criterion.id === score.criterion.id
    );
    if (index < 0) {
      setScores([...scores, score]);
    } else {
      let nextScores = scores.slice();
      nextScores[index] = score;
      setScores(nextScores);
    }
  };

  const submit = () => {
    api.get(`/templates/detail/${templateId}`).then(setTemplate);
    api.post(`/scores/all`, { entities: scores }).then(() => {
      toastHolder.success("Chấm điểm thành công");
    });
  };

  useEffect(() => {
    api.post(`/scores/example`, scoreExample).then(setScores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>{template?.name}</CCardHeader>
      <CCardBody className="pl-0 mr-3">
        <Criterion
          criterion={template?.rootCriterion}
          deep={0}
          scores={scores}
          updateScore={updateScore}
          disableMark={disableMark}
        />
      </CCardBody>
      {!disableMark && (
        <CCardFooter>
          <CButton size="sm" color="primary" onClick={submit}>
            <CIcon name="cil-save" /> Lưu
          </CButton>
        </CCardFooter>
      )}
    </CCard>
  );
};

export default MainComponent;
