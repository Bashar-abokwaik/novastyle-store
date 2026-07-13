import { api } from "./api/client";

// The newsletterService object provides methods for sending newsletters.
export const newsletterService = {
  // Send a newsletter to subscribers
  sendNewsletter: async (subject: string, content: string) => {
    return api.post(
      "/newsletter/send",
      {
        subject,
        content,
      },
      true,
    );
  },
};
