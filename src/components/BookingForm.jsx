import React, { useState } from "react";
import "./BookingForm.css";

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const value =
      e.target.name === "guests"
        ? parseInt(e.target.value) || 0
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (Number(formData.guests) < 1)
      newErrors.guests = "At least 1 guest required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      alert(
        "Booking submitted successfully! We will confirm your reservation shortly."
      );
      setFormData({ name: "", date: "", time: "", guests: 1 });
      setErrors({});
    }
  };

  return (
    <div className="booking-container">
      <form
        onSubmit={handleSubmit}
        className="booking-form"
        aria-label="Booking Form"
      >
        <h2>Book a Table</h2>
        <p className="form-subtitle">Reserve your spot at Little Lemon</p>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            min="11:00"
            max="22:00"
          />
          {errors.time && <span className="error">{errors.time}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="guests">Number of Guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max="10"
            value={formData.guests}
            onChange={handleChange}
          />
          {errors.guests && <span className="error">{errors.guests}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Book Table
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
