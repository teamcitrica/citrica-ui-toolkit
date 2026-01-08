import React from 'react';
import { Container, Col } from '../../atoms/Grid';

export interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  companyName?: string;
  year?: number;
  developedByText?: string;
  devLogoSrc?: string;
  devLogoAlt?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  instagramIconSrc?: string;
  facebookIconSrc?: string;
  linkedinIconSrc?: string;
  height?: string;
  backgroundColor?: string;
  gradient?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoSrc = '/img/home/Logo-galiz.png',
  logoAlt = 'Logo',
  companyName = 'Gáliz Perú',
  year = new Date().getFullYear(),
  developedByText = 'Desarrollado por',
  devLogoSrc = '/img/icons/citrica-logo-col.png',
  devLogoAlt = 'Logo Cítrica',
  socialLinks = {},
  instagramIconSrc = '/img/icons/Instagram.png',
  facebookIconSrc = '/img/icons/Facebook.png',
  linkedinIconSrc = '/img/icons/LinkedIn.png',
  height = '204px',
  backgroundColor,
  gradient = 'linear-gradient(91.06deg, #0D1321 -2.64%, #302967 107.97%)',
  className = '',
}) => {
  const footerStyle: React.CSSProperties = {
    height,
    paddingTop: '5rem',
    background: backgroundColor || gradient,
  };

  return (
    <footer className={className} style={footerStyle}>
      <Container noPadding className="flex items-center justify-around">
        <Col
          noPadding
          cols={{ lg: 3, md: 6, sm: 2 }}
          className="flex items-center justify-around mb-3 only-lg"
        >
          <picture>
            <img src={logoSrc} alt={logoAlt} />
          </picture>
        </Col>

        <Col noPadding cols={{ lg: 5, md: 3, sm: 2 }}>
          <h2 className="letra-citrica mb-3">
            {companyName} {year}
          </h2>
          <div className="letra-citrica-1 flex items-center gap-2">
            <h2 className="letra-citrica-2">{developedByText}</h2>
            <img
              src={devLogoSrc}
              alt={devLogoAlt}
              className="h-6 relative bottom-[7px]"
            />
          </div>
        </Col>

        <Col
          cols={{ lg: 3, md: 3, sm: 2 }}
          className="flex mb-3 only-lg-md-sm"
        >
          <div className="icon-footer-container">
            {socialLinks.instagram && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={socialLinks.instagram}
              >
                <picture>
                  <img
                    className="h-11"
                    src={instagramIconSrc}
                    alt="Instagram icon"
                  />
                </picture>
              </a>
            )}
            {socialLinks.facebook && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={socialLinks.facebook}
              >
                <picture>
                  <img
                    className="h-11"
                    src={facebookIconSrc}
                    alt="Facebook icon"
                  />
                </picture>
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={socialLinks.linkedin}
              >
                <picture>
                  <img
                    className="h-11"
                    src={linkedinIconSrc}
                    alt="LinkedIn icon"
                  />
                </picture>
              </a>
            )}
          </div>
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
