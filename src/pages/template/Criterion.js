import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInput,
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
    <CForm className={`${deep > 0 ? `ml-4 mt-${4 - deep}` : ""}`}>
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
            <CDropdown>
              <CTooltip content={"Giữ và kéo để thay đổi thứ tự"}>
                <CDropdownToggle
                  size="sm"
                  color="primary"
                  variant="outline"
                  split
                >
                  <CIcon name="cil-cursor-move" />
                </CDropdownToggle>
              </CTooltip>
              <CDropdownMenu>
                <CDropdownItem onClick={addCriterion}>
                  Thêm tiêu chí con
                </CDropdownItem>
                {deep > 0 && (
                  <>
                    <CDropdownItem
                      onClick={() => {
                        updateCriterion({
                          ...criterion,
                          mark: !criterion.mark,
                        });
                      }}
                    >
                      {criterion.mark ? "Hủy chấm điểm" : "Chấm điểm tiêu chí"}
                    </CDropdownItem>
                    <CDropdownItem onClick={removeCriterion}>
                      Xóa tiêu chí
                    </CDropdownItem>
                  </>
                )}
              </CDropdownMenu>
            </CDropdown>
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

      {criterion.mark && (
        <CFormGroup row className="m-0 ml-2">
          <CCol className="p-0" style={{ maxWidth: 60 }}>
            <CInput size="sm" placeholder={"Điểm"} />
          </CCol>
          <CCol className="p-0">
            <CTextarea
              size="sm"
              rows={1}
              placeholder={`Bình luận cho: ${criterion.description?.slice(
                0,
                150
              )}`}
            />
          </CCol>
          {edit && (
            <CCol md="0">
              <CTooltip content={`Bỏ chấm điểm tiêu chí`}>
                <CButton
                  size="sm"
                  color="primary"
                  variant={"ghost"}
                  onClick={() => {
                    updateCriterion({
                      ...criterion,
                      mark: false,
                    });
                  }}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </CTooltip>
            </CCol>
          )}
        </CFormGroup>
      )}
    </CForm>
  );
};

export default MainComponent;
