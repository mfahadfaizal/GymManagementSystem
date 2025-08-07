import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookTrainingSession = () => {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({
    trainerId: '',
    memberId: 0, // Placeholder; backend uses authenticated user
    type: '',
    scheduledDate: '',
    duration: '',
    price: '',
    notes: '',
    location: ''
  });

  useEffect(() => {
    axios.get('/api/users/trainers')
      .then(res => setTrainers(res.data))
      .catch(err => console.error('Error fetching trainers:', err));
  }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/training-sessions/book', form);
      alert('Session booked successfully');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Booking failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="trainerId" onChange={handleChange} required>
        <option value="">Select Trainer</option>
        {trainers.map(t => (
          <option key={t.id} value={t.id}>{t.fullName}</option>
        ))}
      </select>
      <input type="datetime-local" name="scheduledDate" onChange={handleChange} required />
      <input type="text" name="type" placeholder="Type (e.g. CARDIO)" onChange={handleChange} required />
      <input type="number" name="duration" placeholder="Duration (min)" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <textarea name="notes" placeholder="Notes" onChange={handleChange}></textarea>
      <button type="submit">Book</button>
    </form>
  );
};

export default BookTrainingSession;
