import CIcon from "@coreui/icons-react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
  CTextarea,
  CWidgetIcon,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";

const MainComponent = () => {
  const councilId = useLocation().pathname.match(
    /(?:\/councils\/detail\/)(\d+)/,
    ""
  )[1];

  const history = useHistory();
  const [council, setCouncil] = useState({});

  useEffect(() => {
    api.get(`/councils/detail/${councilId}`).then(setCouncil);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <h5 className="card-title mb-0">
          Hội đồng {council.subjectDepartmentName} mã số {council.id}
        </h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol className="mb-4">
            <CRow>
              {Object.entries(_.groupBy(council.members, (e) => e.role.name))
                .sort(
                  (a, b) =>
                    a[1][0].role.displayOrder - b[1][0].role.displayOrder
                )
                .map((e) => (
                  <CCol
                    key={e[0]}
                    md={e[1].length > 1 ? 12 : 6}
                    className="border py-2"
                  >
                    <CLabel>{e[0]}</CLabel>
                    <br />
                    <CRow>
                      {e[1].map((councilMember) => (
                        <CCol key={councilMember} md={e[1].length > 1 ? 6 : 12}>
                          <UserCard user={councilMember.member} />
                        </CCol>
                      ))}
                      {_.range(e[1].length, e[1].max).map((e) => (
                        <CCol key={e}></CCol>
                      ))}
                    </CRow>
                  </CCol>
                ))}
              {[].map((role, index) => (
                <CCol
                  key={role.id}
                  md={role.max > 1 ? 12 : 6}
                  className="border py-2"
                >
                  <CLabel>{role.name}</CLabel>
                  <br />
                  <CRow>
                    {role.teachers.map((e) => (
                      <CCol key={e} md={role.max > 1 ? 6 : 12}>
                        <UserCard user={e} />
                      </CCol>
                    ))}
                    {_.range(role.teachers.length, role.max).map((e) => (
                      <CCol key={e}></CCol>
                    ))}
                  </CRow>
                </CCol>
              ))}
            </CRow>
          </CCol>
          <CCol>
            <fieldset disabled={true}>
              <CForm>
                <CFormGroup>
                  <CLabel>Địa điểm</CLabel>
                  <CInput
                    placeholder="Cơ sở, tòa nhà, phòng hoặc link meet..."
                    value={council.location}
                  />
                </CFormGroup>

                <CFormGroup row>
                  <CCol>
                    <CLabel>Ngày</CLabel>
                    <CInput type="date" value={council.reserveDate} />
                  </CCol>
                  <CCol>
                    <CLabel>Thời gian bắt đầu</CLabel>
                    <CInput type="time" value={council.startTime} />
                  </CCol>
                  <CCol>
                    <CLabel>Thời gian kết thúc</CLabel>
                    <CInput type="time" value={council.endTime} />
                  </CCol>
                </CFormGroup>

                <CFormGroup>
                  <CLabel>Ghi chú</CLabel>
                  <CTextarea
                    rows="7"
                    placeholder="Ghi chú..."
                    value={council.note}
                  />
                </CFormGroup>
              </CForm>
            </fieldset>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

const UserCard = ({ user }) => (
  <CWidgetIcon
    color="info"
    iconPadding={false}
    className="mb-2 mx-0 px-0"
    header={
      <>
        <tr class="d-flex justify-content-between">
          <td>{`${user.degreeName} mã số ${user.code}`}</td>
        </tr>
        {`${user.firstName} ${user.lastName}`}
      </>
    }
    text={<small>{`${user.email}`}</small>}
  >
    <CIcon width={24} name="cil-user" />
  </CWidgetIcon>
);

export default MainComponent;
