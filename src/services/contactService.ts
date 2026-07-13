import { api } from "./api/client";

// The contactService object provides methods for sending contact messages.
export const contactService = {
  // Send a contact message to the support team
  sendContactMessage: async (
    name: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    return api.post("/contact", {
      name,
      email,
      subject,
      message,
    });
  },
};
