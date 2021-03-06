import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CTooltip,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StickyBox from "react-sticky-box";
import Criterion from "src/pages/template/Criterion";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ location }) => {
  const history = useHistory();
  const paths = window.location.pathname.split("/");

  const scoreExample = {
    topic: { id: location?.state?.topic?.id },
    teacher: { id: contextHolder.user.id },
    student: { id: location?.state.student?.id },
    template: { id: location?.state.template?.id },
    councilRole: location?.state?.councilRole
      ? { id: location?.state?.councilRole.id }
      : null,
    guideTeacher: paths[1] === "guide",
    reviewTeacher: paths[1] === "review",
  };

  const [scores, setScores] = useState([]);
  const [invalidScore, setInvalidScore] = useState(false);

  const toInt = (input) => (parseInt(input) ? parseInt(input) : 0);

  const updateScore = (score) => {
    score = {
      ...score,
      ...scoreExample,
    };
    if (score.score === "") {
      score.score = null;
    } else {
      score.score = location.state.template?.numberMark
        ? toInt(score.score)
        : score.score?.toUpperCase();
    }
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

  const findUnScores = (criterion) => {
    if (
      criterion.mark &&
      !scores.some(
        (e) =>
          e.criterion?.id === criterion.id &&
          (e.score || e.score === 0) &&
          e.score.length !== 0
      )
    ) {
      return [criterion];
    }
    return criterion.children?.map(findUnScores).flat();
  };

  const submit = () => {
    const unScore = findUnScores(location.state.template?.rootCriterion);
    if (unScore.length !== 0) {
      setInvalidScore(true);
      toastHolder.error("Ch??a ch???m ??i???m");
      return;
    }
    api.post(`/scores/all`, { entities: scores }).then(() => {
      toastHolder.success("Ch???m ??i???m th??nh c??ng");
      location.state.successPath &&
        history.push(`${location.state.successPath}`);
    });
  };

  useEffect(() => {
    api.post(`/scores/example`, scoreExample).then(setScores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let count = 0;

  const renderScore = (criterion) => {
    if (!criterion) return null;
    if (criterion.mark) {
      count++;
      const criterionScore = scores.find(
        (e) => e.criterion?.id === criterion.id
      );
      return (
        <tr className="m-1 mb-1 border-top" style={{ width: 50 }}>
          <CTooltip content={criterion.description ?? ""}>
            <td className="border-right" style={{ width: 20 }}>
              <div>{count}</div>
            </td>
          </CTooltip>
          <CTooltip content={criterionScore?.comment ?? ""}>
            <td className="pl-1">{criterionScore?.score}</td>
          </CTooltip>
        </tr>
      );
    }

    return criterion.children?.map(renderScore, count + 1);
  };

  return (
    <div
      style={{
        overflow: "auto",
        display: "flex",
        alignItems: "flex-start",
        height: 0.75 * window.screen.height,
      }}
    >
      <StickyBox>
        <CCard className="mr-1">
          <center>
            <strong>??i???m</strong>
          </center>
          {renderScore(location.state.template?.rootCriterion)}
          {location.state.template?.numberMark && (
            <>
              T???ng:
              {scores.map((e) => toInt(e.score)).reduce((a, b) => a + b, 0)}
            </>
          )}
        </CCard>
      </StickyBox>
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
            invalidScore={invalidScore}
          />
        </CCardBody>

        {location?.state?.topic?.semester?.id === contextHolder.semester.id && (
          <CCardFooter>
            <CButton color="primary" onClick={submit}>
              <CIcon name="cil-save" /> L??u
            </CButton>
          </CCardFooter>
        )}
      </CCard>
    </div>
  );
};

export default MainComponent;
