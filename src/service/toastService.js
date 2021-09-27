import { CToast, CToastBody, CToastHeader } from "@coreui/react";

const toastSuccess = (message) => {
  toastHolder.toast(
    <CToast show fade color="success" autohide={3000}>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
};

const toastError = (code, message) =>
  toastHolder.toast(
    <CToast show fade color="danger" autohide={5000}>
      <CToastHeader>Lỗi {code}</CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );

const toastHolder = {
  toast: null,
  success: toastSuccess,
  error: toastError,
};

export { toastError };

export default toastHolder;
