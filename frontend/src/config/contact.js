export const SUPPORT_PHONE_DISPLAY = '+91 87924 95478';
export const SUPPORT_WHATSAPP_NUMBER = '918792495478';

export const getWhatsAppUrl = (message) => {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}${query}`;
};
