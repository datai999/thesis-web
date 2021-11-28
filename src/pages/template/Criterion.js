import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CTextarea,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { ReactSortable } from "react-sortablejs";

const MainComponent = ({
  criterion = { children: [] },
  deep,
  edit,
  updateCriterion = () => {},
  removeCriterion = () => {},
  ...props
}) => {
  const score = props.scores?.find(
    (e) => e.criterion.id.toString() === criterion.id.toString()
  );

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
        {...props}
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
    <CForm className={`${deep > 0 ? `ml-4 mt-${4 - deep}` : ""}`}>
      <CFormGroup row className="pl-0 ml-0 mb-0">
        <CCol className="pl-0 pr-1">
          {edit && deep > 0 ? (
            // <CTextarea
            //   rows={parseInt(criterion.description?.length / 130) + 1}
            //   value={criterion.description}
            //   onChange={(e) =>
            //     updateCriterion({ ...criterion, description: e.target.value })
            //   }
            // />
            <CKEditor
              editor={ClassicEditor}
              data={criterion.description}
              onChange={(event, editor) =>
                updateCriterion({ ...criterion, description: editor.getData() })
              }
            />
          ) : deep > 0 ? (
            <div
              dangerouslySetInnerHTML={{ __html: criterion.description }}
            ></div>
          ) : null}
        </CCol>
        {edit && deep < 1 && (
          <CTooltip content={"Thêm mục con"}>
            <CButton
              size="sm"
              color="primary"
              variant="outline"
              onClick={addCriterion}
            >
              <CIcon name="cil-file" />
            </CButton>
          </CTooltip>
        )}
        {edit && deep > 0 && (
          <CCol md="0">
            <CButtonGroup size="sm">
              <CTooltip content={"Giữ và kéo để thay đổi thứ tự"}>
                <CButton color="primary" variant="outline">
                  <CIcon name="cil-cursor-move" />
                </CButton>
              </CTooltip>
              <CTooltip content={"Thêm mục con"}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={addCriterion}
                >
                  <CIcon name="cil-file" />
                </CButton>
              </CTooltip>
            </CButtonGroup>
            <br />
            <CButtonGroup size="sm">
              <CTooltip
                content={
                  criterion.mark ? "Hủy chấm điểm" : "Chấm điểm tiêu chí"
                }
              >
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => {
                    updateCriterion({
                      ...criterion,
                      mark: !criterion.mark,
                    });
                  }}
                >
                  <CIcon name="cil-calculator" />
                </CButton>
              </CTooltip>
              <CTooltip
                content={criterion.comment ? "Tắt bình luận" : "Bình luận"}
              >
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() =>
                    updateCriterion({
                      ...criterion,
                      comment: !criterion.comment,
                    })
                  }
                >
                  <CIcon name="cil-speech" />
                </CButton>
              </CTooltip>
            </CButtonGroup>
            <br />
            <CButtonGroup size="sm">
              <CTooltip content={"Xóa mục này"}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={removeCriterion}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </CTooltip>
            </CButtonGroup>
          </CCol>
        )}
      </CFormGroup>

      {criterion.children &&
        criterion.children.length > 0 &&
        (edit ? (
          <ReactSortable list={criterion?.children} setList={updateChildren}>
            {criterion?.children?.map(renderChildren)}
          </ReactSortable>
        ) : (
          criterion?.children?.map(renderChildren)
        ))}

      {(criterion.mark || criterion.comment) && (
        <CFormGroup row className="m-0 ml-2" style={{ width: "90%" }}>
          {criterion.mark && (
            <CCol className="p-0" style={{ maxWidth: 70 }}>
              <CInput
                size="sm"
                placeholder={"Điểm"}
                value={score?.score}
                disabled={props.disableMark}
                required={props.invalidScore}
                invalid={props.invalidScore && !score?.score}
                valid={score?.score && score?.score.length > 0}
                onChange={(e) =>
                  props.updateScore &&
                  props.updateScore({
                    ...score,
                    criterion: { id: criterion.id },
                    score: e.target.value,
                  })
                }
              />
            </CCol>
          )}
          {criterion.comment && (
            <CCol className="p-0">
              <CTextarea
                size="sm"
                rows={1}
                placeholder={`Bình luận...`}
                value={score?.comment}
                disabled={props.disableMark}
                onChange={(e) =>
                  props.updateScore &&
                  props.updateScore({
                    ...score,
                    criterion: { id: criterion.id },
                    comment: e.target.value,
                  })
                }
              />
            </CCol>
          )}
        </CFormGroup>
      )}
    </CForm>
  );
};

export default MainComponent;
