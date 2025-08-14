import React, { useState, useEffect } from 'react';
import { gymClassAPI, trainingSessionAPI } from '../services/api';
import api from '../services/api'; // To fetch trainers

const BookTrainingSession = () => {
  const [trainers, setTrainers] = useState([]);
  const [activeClasses, setActiveClasses] = useState([]);
  const [form, setForm] = useState({
    trainerId: '',
    memberId: 0, // <-- Replace with logged-in member ID if available
    type: '',
    scheduledDate: '',
    duration: '',
    price: '',
    notes: '',
    location: ''
  });

  // Fetch trainers on load
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get('/api/users/trainers');
        setTrainers(res.data);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setTrainers([]);
      }
    };

    fetchTrainers();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'trainerId' && value) {
      try {
        const res = await gymClassAPI.getActiveByTrainer(value);
        setActiveClasses(res.data);
      } catch (err) {
        console.error('Error fetching active gym classes:', err);
        setActiveClasses([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainingSessionAPI.bookSession(form);
      alert('Session booked successfully');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Booking failed'));
    }
  };

  const sessionTypes = [
    'PERSONAL_TRAINING',
    'GROUP_TRAINING',
    'CONSULTATION',
    'ASSESSMENT',
    'NUTRITION_COUNSELING'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Training Session</h2>

      <label>Trainer</label>
      <select name="trainerId" onChange={handleChange} required>
        <option value="">Select Trainer</option>
        {trainers.length > 0 ? (
          trainers.map(t => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))
        ) : (
          <option disabled>Loading trainers...</option>
        )}
      </select>

      <label>Date & Time</label>
      <input
        type="datetime-local"
        name="scheduledDate"
        onChange={handleChange}
        required
      />

      <label>Session Type</label>
      <select name="type" onChange={handleChange} required>
        <option value="">Select Session Type</option>
        {sessionTypes.map(type => (
          <option key={type} value={type}>
            {type.replace(/_/g, ' ')}
          </option>
        ))}
      </select>

      <label>Duration (minutes)</label>
      <input
        type="number"
        name="duration"
        placeholder="Duration (min)"
        onChange={handleChange}
        required
      />

      <label>Price</label>
      <input
        type="number"
        name="price"
        placeholder="Price"
        onChange={handleChange}
        required
      />

      <label>Location</label>
      <input
        type="text"
        name="location"
        placeholder="Location"
        onChange={handleChange}
        required
      />

      <label>Notes</label>
      <textarea
        name="notes"
        placeholder="Notes"
        onChange={handleChange}
      ></textarea>

      <button type="submit">Book</button>

      {activeClasses.length > 0 && (
        <div>
          <h4>Active Gym Classes for Selected Trainer:</h4>
          <ul>
            {activeClasses.map(c => (
              <li key={c.id}>
                {c.name} — {new Date(c.startTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default BookTrainingSession;
