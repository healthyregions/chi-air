import styled from 'styled-components';
import { ContentContainer } from '../../styled_components';
import { colors } from '../../config';
import ParquetReaderComponent from "../Map/ParquetReaderComponent";
import {useEffect, useState} from "react";
import {productName} from "../VariablePanel/common";

const PreloaderPage = styled.div`
    background:${colors.gray};
    min-height:100vh;
    h2 {
        position:fixed;
        left:50%;
        top:60%;
        transform:translateX(-50%);
        color:white;
    }
    img {
        width:100px;
        height:86px;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
    }
`

const PrevLoadingMessage = () => {
    return (
       <PreloaderPage>
           <ContentContainer className="transferInfo">
                <h2>loading...</h2>
                <img src={`${process.env.PUBLIC_URL}/assets/img/preloader.gif`} alt="Preloader" />
           </ContentContainer>
       </PreloaderPage>
    );
}


const LoadingMessage = () => {
  const [loadingText, setLoadingText] = useState('Loading');

  // Simple dots animation text fallback
  useEffect(() => {
    const intervals = ['Loading.', 'Loading..', 'Loading...'];
    let idx = 0;
    const interval = setInterval(() => {
      setLoadingText(intervals[idx]);
      idx = (idx + 1) % intervals.length;
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <PreloaderPage style={styles.container}>
      {/* Google Fonts Pre-requisites embedded inline for convenience */}
      <link rel="preconnect" href="https://googleapis.com" />
      <link rel="preconnect" href="https://gstatic.com" crossOrigin="true" />
      <link href="https://googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />

      <div style={styles.content}>
        {/* The 4 Iconic Chicago 6-pointed Stars Layout */}
        <div style={styles.starRow}>
          {[...Array(4)].map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              style={{
                ...styles.star,
                animation: `chicagoPulse 1.2s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`
              }}
            >
              {/* Custom SVG Path for the specific 6-pointed sharp Chicago Star */}
              <path
                fill="#E4002B"
                d="M12,2 L14,9 L21,7 L16,12 L21,17 L14,15 L12,22 L10,15 L3,17 L8,12 L3,7 L10,9 Z"
              />
            </svg>
          ))}
        </div>

        {/* Dynamic Chicago-Style Progress Indicator */}
        <div style={styles.track}>
          <div style={styles.progressBar} />
        </div>

        {/* Typography structured strictly via Chicago Design System specs */}
        <h1 style={styles.title}>{productName}</h1>
        <h3 style={styles.subtitle}>CHICAGO</h3>
        <small style={styles.subsubtitle}>{loadingText.toUpperCase()}</small>
      </div>

      {/* Embedded keyframe styles for standard browser rendering */}
      <style>{`
        @keyframes chicagoPulse {
          0% { transform: scale(0.85); opacity: 0.4; filter: drop-shadow(0 0 0px rgba(228,0,43,0)); }
          100% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 8px rgba(228,0,43,0.5)); }
        }
        @keyframes trackFill {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 110%; width: 20%; }
        }
      `}</style>
    </PreloaderPage>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  starRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  star: {
    width: '40px',
    height: '40px',
  },
  track: {
    position: 'relative',
    width: '180px',
    height: '4px',
    backgroundColor: '#E8F5FA', // Light tint background
    borderTop: '4px solid #41B6E6', // Top Flag Blue band
    borderBottom: '4px solid #41B6E6', // Bottom Flag Blue band
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#E4002B', // Star Red moving indicator
    animation: 'trackFill 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  title: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: 700,
    fontSize: '2.5rem',
    letterSpacing: '0.15em',
    color: '#444444',
    margin: '0 0 4px 0',
    lineHeight: '1',
  },
  subtitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: 500,
    fontSize: '1rem',
    letterSpacing: '0.25em',
    color: colors.chicagoBlue, // Flag Blue accent text
    margin: 0,
  },
  subsubtitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: 500,
    fontSize: '0.5rem',
    letterSpacing: '0.25em',
    color: colors.chicagoBlue, // Flag Blue accent text
    margin: 0,
  }
};

export default LoadingMessage;
