import { CCard, CCardBody } from "@coreui/react";
import React, { useEffect } from "react";
import { CouncilList } from "src/pages/assign/council/AssignCouncilList";
import api from "src/service/api";
import context from "src/service/contextService";

const MainComponent = () => {
  const semesterName = window.location.pathname.split("/").pop();

  const [data, setData] = React.useState([]);

  const getData = () => {
    api
      .post(
        `/council-members/council`,
        {
          council: {
            subjectDepartment: context.user.subjectDepartment?.id,
            semester: { name: semesterName },
          },
          member: { id: context.user?.id },
        },
        {
          params: {
            direction: "DESC",
          },
        }
      )
      .then(setData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterName]);

  return (
    <CCard>
      <CCardBody>
        <CouncilList
          subjectDepartmentId={context.user.subjectDepartment?.id}
          data={data}
          assign={false}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
