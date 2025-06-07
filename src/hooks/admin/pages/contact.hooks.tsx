import { useState } from "react";

export function useContactMessageDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setMessage(null);
  };

  return {
    open,
    message,
    showMessage,
    closeDialog,
  };
}
