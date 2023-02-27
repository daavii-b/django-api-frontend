import { toast, Slide } from 'react-toastify';

export function manageToastNotification(id, type) {
  if (toast.isActive(id)) {
    toast.update(id, {
      type: toast.TYPE[type.toUpperCase()],
      toastId: id,
      transition: Slide,
    });
  }
}
