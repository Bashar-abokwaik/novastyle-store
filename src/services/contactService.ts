export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const contactService = {
  sendMessage: async (data: ContactMessage) => {
    console.log("fake send:", data);
  },
};
