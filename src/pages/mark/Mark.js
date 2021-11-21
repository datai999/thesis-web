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

const MainComponent = ({ location }) => {
  const scoreExample = {
    topic: { id: location?.state?.topicId },
    teacher: { id: contextHolder.user.id },
    student: { id: location?.state.studentId },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <h5>{location.state.template?.name}</h5>
      </CCardHeader>
      <CCardBody className="ml-3 mr-3">
        <div
          dangerouslySetInnerHTML={{
            __html: location.state.template?.description,
          }}
        />
        <Criterion
          criterion={location.state.template?.rootCriterion}
          deep={0}
          scores={scores}
          updateScore={updateScore}
          disableMark={false}
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
