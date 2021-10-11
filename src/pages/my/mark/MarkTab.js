import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Criterion from "src/pages/template/Criterion";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ settingTemplate, topicId, studentId }) => {
  const scoreExample = {
    settingTemplate: { id: settingTemplate.id },
    topic: { id: topicId },
    teacher: { id: contextHolder.user.id },
    student: { id: studentId },
  };

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
    api.post(`/scores/all`, { entities: scores }).then(() => {
      toastHolder.success("Chấm điểm thành công");
    });
  };

  useEffect(() => {
    api.post(`/scores/example`, scoreExample).then(setScores);
  }, []);

  return (
    <CCard>
      <CCardHeader>{settingTemplate.template?.description}</CCardHeader>
      <CCardBody className="pl-0 mr-3">
        <Criterion
          criterion={settingTemplate.template?.rootCriterion}
          deep={0}
          scores={scores}
          updateScore={updateScore}
        />
      </CCardBody>
      <CCardFooter>
        <CButton size="sm" color="primary" onClick={submit}>
          <CIcon name="cil-save" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default MainComponent;
