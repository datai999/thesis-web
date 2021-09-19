import { CToast, CToastBody, CToastHeader } from "@coreui/react";

const toastHolder = {
  toast: null,
};

const toast = (toast) => toastHolder.toast(toast);

const toastError = (code, message) =>
  toastHolder.toast(
    <CToast show fade color="danger" autohide={4000}>
      <CToastHeader>Lỗi {code}</CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );

export { toastHolder, toastError };

export default toast;
