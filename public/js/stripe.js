import axios from 'axios';
import { showAlert } from './alerts';

let stripe;

if (typeof window !== 'undefined' && window.Stripe) {
  stripe = window.Stripe('pk_test_51QW1DRLEvYjRRnfaxdTcQ0BXaclluj9O6kOUljkkLzEBBwdXRnPl1gHy9IlweJcDcnbWJNVdFnkaP70M2g3rdp7000U5by9Orc');
}

export const bookTour = async (tourId) => {
  try {
    showAlert('info', 'Redirecting to payment...');

    const response = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
    const sessionId = response.data.session.id;

    // Redirect to Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    showAlert(
      'error',
      error.response?.data?.message || error.message || 'Something went wrong!'
    );
  }
};
