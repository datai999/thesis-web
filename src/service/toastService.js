import { CToast, CToastBody, CToastHeader } from "@coreui/react";

const toastSuccess = (message) => {
  toastHolder.toast(
    <CToast show fade color="success" autohide={3000}>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
};

const toastWarning = (message) => {
  toastHolder.toast(
    <CToast show fade color="warning" autohide={3000}>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
};

const toastError = (message, code) =>
  toastHolder.toast(
    <CToast show fade color="danger" autohide={5000}>
      <CToastHeader>Lỗi {code}</CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );

const toastHolder = {
  toast: null,
  success: toastSuccess,
  warning: toastWarning,
  error: toastError,
};

export { toastError, toastHolder };

export default toastHolder;
