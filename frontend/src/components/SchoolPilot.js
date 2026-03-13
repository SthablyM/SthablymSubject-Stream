// src/components/SchoolPilot.js
import React, { useState } from "react";
import "./SchoolPilot.css";

function SchoolPilot() {
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    email: "",
    phone: "",
    grades: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this with your email API or form backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="school-pilot-container">
      <h1>School Pilot Program</h1>
      <p>
        Full access to Subject Stream for all high school grades (9–12) is available for schools through our pilot program. 
        Contact us today to schedule a demo and see how our platform can support your students’ success.
      </p>

      <div className="demo-section">
        <h2>Demo Preview</h2>
        <p>Try a limited version of the platform below:</p>
        <button onClick={() => window.alert("Demo: Grade 9 subject selection quiz")}>
          Try Demo Quiz
        </button>
        <p className="demo-note">
          For full access to all grades, APS calculator, past questions, and bursary links, please submit your pilot request.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="school-pilot-form">
          <input
            type="text"
            name="schoolName"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="grades"
            placeholder="Grades (e.g., 9-12)"
            value={formData.grades}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Additional Message (optional)"
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit">Request Pilot Demo</button>
        </form>
      ) : (
        <p className="thank-you">Thank you! We will contact you shortly to schedule your demo.</p>
      )}
    </div>
  );
}

export default SchoolPilot;