import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 3rem 0;
  border-top: 1px solid #eee;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #303064;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.8rem;
  }

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #3a3a7e;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    color: #666;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      color: #3a3a7e;
      background-color: rgba(58, 58, 126, 0.1);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CopyrightBar = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 1rem 0;
  border-top: 1px solid #ddd;
  color: #666;
  font-size: 0.9rem;
  text-align: center;

  a {
    color: #3a3a7e;
    text-decoration: none;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>TherHappy</h3>
          <p>
            Your AI companion for mental wellness support and emotional
            well-being.
          </p>
          <SocialLinks>
            <a href='https://twitter.com' aria-label='Twitter'>
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
              </svg>
            </a>
            <a href='https://facebook.com' aria-label='Facebook'>
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z' />
              </svg>
            </a>
            <a href='https://instagram.com' aria-label='Instagram'>
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' />
              </svg>
            </a>
            <a href='https://linkedin.com' aria-label='LinkedIn'>
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z' />
              </svg>
            </a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Features</h3>
          <FooterLinks>
            <li>
              <Link to='/features'>Voice Conversations</Link>
            </li>
            <li>
              <Link to='/features'>Emotion Recognition</Link>
            </li>
            <li>
              <Link to='/features'>Privacy</Link>
            </li>
            <li>
              <Link to='/features'>Crisis Support</Link>
            </li>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Company</h3>
          <FooterLinks>
            <li>
              <Link to='/about'>About Us</Link>
            </li>
            <li>
              <Link to='/careers'>Careers</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
            <li>
              <Link to='/blog'>Blog</Link>
            </li>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Resources</h3>
          <FooterLinks>
            <li>
              <Link to='/help'>Help Center</Link>
            </li>
            <li>
              <Link to='/privacy'>Privacy Policy</Link>
            </li>
            <li>
              <Link to='/terms'>Terms of Service</Link>
            </li>
            <li>
              <a
                href='https://www.nimh.nih.gov'
                target='_blank'
                rel='noopener noreferrer'>
                Mental Health Resources
              </a>
            </li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>

      <CopyrightBar>
        &copy; {new Date().getFullYear()} TherHappy. All rights reserved. <br />
        <small>
          This is a prototype. Not a replacement for professional mental health
          services.
        </small>
      </CopyrightBar>
    </FooterContainer>
  );
};

export default Footer;
