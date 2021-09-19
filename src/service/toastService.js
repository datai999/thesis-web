import { CToast, CToastBody, CToastHeader } from "@coreui/react";

export const toastHolder = {
  toast: () => {},
};

export default (toast) => toastHolder.toast(toast);

export const toastError = (code, message) =>
  toastHolder.toast(
    <CToast show fade color="danger" autohide={4000}>
      <CToastHeader>Lỗi {code}</CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
