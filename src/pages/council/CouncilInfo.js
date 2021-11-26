import { CCol, CLabel, CRow } from "@coreui/react";
import _ from "lodash";
import React from "react";
import UserCard from "src/components/UserCard";

const MainComponent = ({ council }) => {
  return (
    <div>
      <CRow>
        <CCol className="mb-4">
          <CRow>
            {Object.entries(_.groupBy(council.members, (e) => e.role.name))
              .sort(
                (a, b) => a[1][0].role.displayOrder - b[1][0].role.displayOrder
              )
              .map((e) => (
                <CCol
                  key={e[0]}
                  md={e[1].length > 1 ? 12 : 6}
                  className="border py-2"
                >
                  <CLabel>
                    <strong>{e[0]}</strong>
                  </CLabel>
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
        <CCol className="border ml-2 py-3 mb-4">
          <div>
            <strong>Địa điểm: </strong>
            {council.location}
          </div>

          <br />

          <CRow>
            <CCol md="4">
              <strong>Ngày: </strong>
              {council.reserveDate}
            </CCol>

            <CCol>
              <strong>Thời gian bắt đầu: </strong>
              {council.startTime}
            </CCol>
          </CRow>

          <br />

          <div>
            <strong>Ghi chú</strong>
            <div
              className="border p-2"
              dangerouslySetInnerHTML={{ __html: council.note }}
            />
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

export default MainComponent;
