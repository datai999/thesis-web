import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormGroup,
  CTextarea,
  CTooltip
} from "@coreui/react";
import React from "react";
import { ReactSortable } from "react-sortablejs";

const MainComponent = ({
  criterion,
  deep,
  edit,
  updateCriterion = () => {},
  removeCriterion = () => {},
}) => {
  const updateChildren = (children) =>
    updateCriterion({ ...criterion, children });

  const addCriterion = () => {
    const nextCriterion = { ...criterion };
    nextCriterion.children = [
      ...criterion.children,
      { parentId: criterion.id, children: [] },
    ];
    updateCriterion(nextCriterion);
  };

  const localUpdateCriterion = (index, nextItem) => {
    const nextChildren = [...criterion.children];
    nextChildren[index] = nextItem;
    updateChildren(nextChildren);
  };

  const localRemoveCriterion = (index) => {
    const nextChildren = [...criterion.children];
    nextChildren.splice(index, 1);
    updateChildren(nextChildren);
  };

  const renderChildren = (item, index) => {
    return (
      <MainComponent
        key={item.id}
        criterion={item}
        deep={deep + 1}
        edit={edit}
        updateCriterion={(nextItem) => localUpdateCriterion(index, nextItem)}
        removeCriterion={() => localRemoveCriterion(index)}
      />
    );
  };

  return (
    <CForm className={`ml-4 ${deep > 0 ? `mt-${4 - deep}` : ""}`}>
      <CFormGroup row className="pl-0 ml-0 mb-0">
        <CCol className="pl-0 pr-1">
          {edit && deep > 0 ? (
            <CTextarea
              rows={parseInt(criterion.description?.length / 130) + 1}
              value={criterion.description}
              onChange={(e) =>
                updateCriterion({ ...criterion, description: e.target.value })
              }
            />
          ) : (
            <>{deep > 0 ? criterion.description : null}</>
          )}
        </CCol>
        {edit && (
          <CCol md="0">
            <CButtonGroup size="sm">
              <CTooltip content={"Giữ và kéo để thay đổi thứ tự"}>
                <CButton
                  color="primary"
                  variant={deep > 0 ? "outline" : "ghost"}
                  disabled={deep < 1}
                >
                  <CIcon name="cil-cursor-move" />
                </CButton>
              </CTooltip>
              <CTooltip content={"Thêm tiêu chí con"}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={addCriterion}
                >
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTooltip>
              <CTooltip content={"Xóa tiêu chí"}>
                <CButton
                  color="primary"
                  variant={deep > 0 ? "outline" : "ghost"}
                  disabled={deep < 1}
                  onClick={removeCriterion}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </CTooltip>
            </CButtonGroup>
          </CCol>
        )}
      </CFormGroup>

      {edit ? (
        <ReactSortable list={criterion.children} setList={updateChildren}>
          {criterion?.children?.map(renderChildren)}
        </ReactSortable>
      ) : (
        criterion?.children?.map(renderChildren)
      )}
    </CForm>
  );
};

export default MainComponent;
