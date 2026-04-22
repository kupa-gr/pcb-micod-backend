import React, { useState } from 'react';
import Reveal from '../components/Reveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoUrl = `mailto:gracekupa6@gmail.com?subject=Contact from ${name}&body=From: ${name} (${email})%0D%0A%0D%0A${message}`;
    window.location.href = mailtoUrl;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page-wrapper py-5">
      <div className="contact-container">
        {/* Left Side - Dark Form */}
        <div className="contact-left">
          <Reveal direction="left">
            <h1>Contact Us</h1>
            <form className="contact-form-styled" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message" 
                  placeholder="Your Message" 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button type="submit" className="btn-submit-red">Submit</button>
            </form>
          </Reveal>
        </div>

        {/* Right Side - Illustration */}
        <div className="contact-right">
          <Reveal direction="right">
            <img 
              src="/contact_illustration.png" 
              alt="Contact Illustration" 
              className="contact-illustration"
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
