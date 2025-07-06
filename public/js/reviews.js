import axios from 'axios';
import { showAlert } from './alerts';  // Your alert utility

const reviewForm = document.querySelector('.form--review');

if (reviewForm) {
  const tourId = reviewForm.dataset.tourId;

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    try {
      const res = await axios({
        method: 'POST',
        url: `/api/v1/tours/${tourId}/reviews`,
        data: {
          rating,
          review,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Review submitted successfully!');
        reviewForm.reset();
        // Optionally reload or update the reviews list dynamically here
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to submit review');
    }
  });
}
