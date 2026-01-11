import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />
      
      <div className="about-container">
        <Card>
          <div className="about-header">
            <h1 className="about-title">
              <span style={{fontSize: '2rem', marginRight: '0.75rem'}}>🛍️</span>
              About Grocery Management System
            </h1>
            <p className="about-subtitle">Your Smart Grocery Shopping Partner</p>
          </div>

          <div className="about-content">
            <section className="about-section">
              <h2>Welcome to Your Smart Grocery Solution</h2>
              <p>
                Grocery Management System is your one-stop solution for managing groceries efficiently. 
                We provide a seamless online shopping experience that combines convenience, quality, and reliability.
                Our platform is designed to make your grocery shopping effortless and enjoyable.
              </p>
            </section>

            <section className="about-section">
              <h2>🌟 Our Features</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🥬</div>
                  <h3>Quality Products</h3>
                  <p>Browse through a wide range of fresh and quality grocery items carefully selected for you.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📝</div>
                  <h3>Smart Shopping Lists</h3>
                  <p>Create and manage shopping lists for organized and efficient shopping experience.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🛒</div>
                  <h3>Easy Ordering</h3>
                  <p>Seamless online ordering with intuitive interface and smooth checkout process.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Real-time Inventory</h3>
                  <p>Live inventory tracking ensures product availability and accurate stock information.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h3>Secure Payments</h3>
                  <p>Safe and secure payment options including Cash on Delivery for your convenience.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🚚</div>
                  <h3>Fast Delivery</h3>
                  <p>Quick and reliable delivery to your doorstep with real-time order tracking.</p>
                </div>
              </div>
            </section>

            <section className="about-section mission-section">
              <h2>🎯 Our Mission</h2>
              <p className="mission-text">
                To make grocery shopping effortless and enjoyable by providing a comprehensive digital platform 
                that connects customers with quality products, while ensuring convenience, transparency, and 
                exceptional service. We strive to revolutionize the way people shop for groceries by leveraging 
                technology to create a seamless, user-friendly experience.
              </p>
            </section>

            <section className="about-section">
              <h2>💡 Why Choose Us?</h2>
              <ul className="benefits-list">
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>User-Friendly Interface</strong>
                    <p>Designed for everyone - easy to navigate and simple to use</p>
                  </div>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>Comprehensive Product Catalog</strong>
                    <p>Detailed information about every product including nutritional facts</p>
                  </div>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>Flexible Delivery Options</strong>
                    <p>Choose delivery times that suit your schedule</p>
                  </div>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>Responsive Customer Support</strong>
                    <p>Our team is always ready to help with any questions or concerns</p>
                  </div>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>Regular Updates</strong>
                    <p>Continuous improvements and new features based on customer feedback</p>
                  </div>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <div>
                    <strong>Quality Assurance</strong>
                    <p>Rigorous quality checks to ensure you get the best products</p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="about-section">
              <h2>🚀 Our Journey</h2>
              <p>
                Founded with a vision to simplify grocery shopping, we've grown from a simple idea to a 
                comprehensive platform serving thousands of customers. Our commitment to quality, customer 
                satisfaction, and innovation drives us forward every day.
              </p>
            </section>

            <section className="about-section values-section">
              <h2>💎 Our Values</h2>
              <div className="values-grid">
                <div className="value-item">
                  <h3>Quality First</h3>
                  <p>We never compromise on the quality of products we deliver</p>
                </div>
                <div className="value-item">
                  <h3>Customer Centric</h3>
                  <p>Your satisfaction and convenience are our top priorities</p>
                </div>
                <div className="value-item">
                  <h3>Innovation</h3>
                  <p>Continuously improving and adapting to meet your needs</p>
                </div>
                <div className="value-item">
                  <h3>Transparency</h3>
                  <p>Honest pricing and clear communication in all our dealings</p>
                </div>
              </div>
            </section>

            <section className="about-section contact-section">
              <h2>📞 Get In Touch</h2>
              <p>
                Have questions or suggestions? We'd love to hear from you! Reach out to us through any of 
                the following channels:
              </p>
              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h4>Email</h4>
                  <p>nandkishorjadhav9580@gmail.com</p>
                  <p>pallavitate746@gmail.com</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📱</div>
                  <h4>Phone</h4>
                  <p>+91-7378828085</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📍</div>
                  <h4>SGGSIE&T</h4>
                  <p>[SGGSIE&T VISHNUPURI, NANDED]</p>
                </div>
              </div>
            </section>

            <div className="about-cta">
              <h3>Start Shopping Today!</h3>
              <p>Join thousands of happy customers who trust us for their grocery needs.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
