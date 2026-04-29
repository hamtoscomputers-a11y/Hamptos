import api from '../axios'; // or your axios instance

export const guestCheckout = async (orderData: any) => {
  const response = await api.post('/api/v1/orders/guest-checkout', orderData);
  return response.data;
};
