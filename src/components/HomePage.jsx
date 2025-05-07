import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;

const LoginButton = styled.button`
  background: #333;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const About = styled.section`
  margin-bottom: 40px;
`;

const Services = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const ServiceCard = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9em;
  color: #999;
`;

function HomePage() {
  return (
    <Container>
      <Header>
        <h1>FoundryHQ</h1>
        <LoginButton>Login</LoginButton>
      </Header>

      <About>
        <h2>About Us</h2>
        <p>
          FoundryHQ helps you turn business ideas into real companies.
          We offer marketing, full website builds, and AI-powered business creation from idea to launch.
        </p>
      </About>

      <Services>
        <ServiceCard>
          <h3>Growth Spark</h3>
          <p>Marketing for existing businesses including SEO and social media ads.</p>
        </ServiceCard>
        <ServiceCard>
          <h3>Launch Kit</h3>
          <p>Website + marketing for new businesses, including domain setup and hosting.</p>
        </ServiceCard>
        <ServiceCard>
          <h3>Empire Mode</h3>
          <p>Fully guided AI-powered business creation with domain, site, and launch strategy.</p>
        </ServiceCard>
      </Services>

      <Footer>© FoundryHQ</Footer>
    </Container>
  );
}

export default HomePage;
