import React from "react";
import SubjectDepartmentTab from "src/components/SubjectDepartmentTab";
import AssignReviewTable from "./AssignReviewTable";

const MainComponent = () => (
  <SubjectDepartmentTab
    URL="/assign/review"
    InnerComponent={AssignReviewTable}
  />
);

export default MainComponent;
