import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Using window.location.origin to dynamically generate the QR join link
  const joinUrl = `${window.location.protocol}//${window.location.host}/register`;

  return (
    <div className="fade-in" style={{ textAlign: 'center' }}>
      <h1 className="neon-text" style={{ fontSize: '4rem', marginBottom: '10px' }}>
        TEXPERIA 2K26
      </h1>
      <h2 style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Ultimate Technical Battle of Logic, Code, and Debugging
      </h2>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto 40px', textAlign: 'left' }}>
        <h3 className="neon-text" style={{ marginBottom: '20px' }}>What is CodeRush?</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
          CodeRush is a multi-round programming competition testing participants in:
          <br /><br />
          • <span style={{ color: 'var(--cyan)' }}>Programming Logic</span><br />
          • <span style={{ color: 'var(--neon-purple)' }}>Debugging Ability</span><br />
          • <span style={{ color: 'var(--electric-blue)' }}>Algorithmic Thinking</span>
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Prize: Glory and Exciting Rewards!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>Ready to compete?</h3>
          <Link to="/register">
            <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
              Start Game
            </button>
          </Link>
        </div>

        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>Join via QR Code</h3>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <QRCodeSVG value={joinUrl} size={150} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Scan to register your team</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
