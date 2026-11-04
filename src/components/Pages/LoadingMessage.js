import styled from 'styled-components';
import { colors } from '../../config';
import {useEffect, useState} from "react";
import {productName} from "../VariablePanel/common";

const PreloaderPage = styled.div`
    background:${colors.gray};
    min-height:100vh;
    h2 {
        position:fixed;
        left:50%;
        top:50%;
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

const PRELOADER_MESSAGES = [
  "Fetching the latest data...",
  "Optimizing performance...",
  "Almost there...",
  "Powered by Chicago...",
  "Securing connection...",
  "Preparing your workspace...",
  "Generating matrices...",
  "Reticulating splines...",
  "Replicating topology...",
  "Sorry for the wait...",
];

const LoadingMessage = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 2.5 seconds
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % PRELOADER_MESSAGES.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const size = '100';

  return (
    <PreloaderPage style={styles.container}>
      {/* Google Fonts Pre-requisites embedded inline for convenience */}
      <link rel="preconnect" href="https://googleapis.com" />
      <link rel="preconnect" href="https://gstatic.com" crossOrigin="true" />
      <link href="https://googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />

      <div style={styles.content}>
        {/* The 4 Iconic Chicago 6-pointed Stars Layout */}
        <div style={styles.starRow}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0s`
          }}>
            <path d="M100 120C44.7715 120 0 75.2285 0 20C55.2285 20 100 64.7715 100 120Z" fill="#41B6E6"/>
          </svg>

          <svg viewBox={`100 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.1s`
          }}>
            <path d="M100 120V70C127.614 70 150 92.3858 150 120H100Z" fill="#41B6E6"/>
            <path d="M150 120V70C177.614 70 200 92.3858 200 120H150Z" fill="#005899"/>
            <path d="M100 70V20C127.614 20 150 42.3858 150 70H100Z" fill="#005899"/>
            <path d="M150 70V20C177.614 20 200 42.3858 200 70H150Z" fill="#41B6E6"/>
          </svg>

          <svg viewBox={`200 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.2s`
          }}>
            <circle cx="250" cy="70" r="50" transform="rotate(90 250 70)" fill="#41B6E6"/>
            <path d="M285 105C246.34 105 215 73.6599 215 35C253.66 35 285 66.3401 285 105Z" fill="#005899"/>
          </svg>

          <svg viewBox={`300 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.3s`
          }}>
            <path d="M300 120V20C355.228 20 400 64.7715 400 120H300Z" fill="#005899"/>
          </svg>

          <svg viewBox={`392 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.4s`
          }}>
            <circle cx="442" cy="70" r="50" transform="rotate(90 442 70)" fill="#41B6E6"/>
            <circle cx="442" cy="70" r="25" transform="rotate(90 442 70)" fill="#005899"/>
          </svg>

          <svg viewBox={`488 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.5s`
          }}>
            <circle cx="563" cy="45" r="25" transform="rotate(90 563 45)" fill="#41B6E6"/>
            <circle cx="563" cy="95" r="25" transform="rotate(90 563 95)" fill="#005899"/>
            <circle cx="513" cy="95" r="25" transform="rotate(90 513 95)" fill="#41B6E6"/>
            <circle cx="513" cy="45" r="25" transform="rotate(90 513 45)" fill="#005899"/>
          </svg>

          <svg viewBox={`570 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.6s`
          }}>
            <path d="M573 70L623 20L673 70H573Z" fill="#41B6E6"/>
            <path d="M673 70L623 120L573 70H673Z" fill="#005899"/>
          </svg>

          <svg viewBox={`673 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.7s`
          }}>
            <path d="M688.322 105.678C668.796 86.1514 668.796 54.4932 688.322 34.9669L759.033 105.678C739.507 125.204 707.849 125.204 688.322 105.678Z" fill="#005899"/>
            <path d="M758.644 35.3553C778.171 54.8816 778.171 86.5398 758.644 106.066L687.934 35.3553C707.46 15.8291 739.118 15.8291 758.644 35.3553Z" fill="#41B6E6"/>

          </svg>
          <svg viewBox={`775 0 ${size} ${size}`} style={{
            ...styles.star,
            animationDelay: `0.8s`
          }}>
            <path d="M824 70C824 97.6142 801.614 120 774 120V20C801.614 20 824 42.3858 824 70Z" fill="#005899"/>
            <path d="M874 70C874 97.6142 851.614 120 824 120V20C851.614 20 874 42.3858 874 70Z" fill="#41B6E6"/>
          </svg>
        </div>

        {/* Dynamic Chicago-Style Progress Indicator */}
        <p key={messageIndex} style={styles.loadingText}>{PRELOADER_MESSAGES?.[messageIndex]}</p>
        <div style={styles.track}>
          <div style={{
            ...styles.progressBar,
            width: `${messageIndex / (PRELOADER_MESSAGES?.length - 1)}%`
          }} />
        </div>

        {/* Typography structured strictly via Chicago Design System specs */}
        <h1 style={styles.title}>{productName}</h1>
        <h3 style={styles.subtitle}>CHICAGO</h3>

        <svg
          viewBox="0 0 24 24"
          style={{
            ...styles.star,
            marginTop: '1rem',
            width: '40px',
            height: '40px',
            animation: 'none',
            animationDelay: `0s`
          }}
        >
          {/* Custom SVG Path for the specific 6-pointed sharp Chicago Star */}
          <path
            fill="#E4002B"
            d="M12,2 L14,9 L21,7 L16,12 L21,17 L14,15 L12,22 L10,15 L3,17 L8,12 L3,7 L10,9 Z"
          />
        </svg>
      </div>

      {/* Embedded keyframe styles for standard browser rendering */}
      <style>{`
        @keyframes chicagoPulse {
          0% { transform: scale(0.5); opacity: 0.4; filter: drop-shadow(0 0 0px rgb(0, 88, 153)); }
          100% { transform: scale(1.0); opacity: 1; filter: drop-shadow(0 0 6px rgb(0, 88, 153)); }
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
    width: '50px',
    height: '80px',
    animation: `chicagoPulse 1.2s ease-in-out infinite alternate`,
    //width: '40px',
    //height: '40px',
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
    fontFamily: 'Lexend, sans-serif',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.25em',
    color: colors.chicagoDarkBlue, // Flag Blue accent text
    margin: 0,
  },
  loadingText: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: 500,
    fontSize: '0.6rem',
    letterSpacing: '0.25em',
    color: colors.chicagoBlue, // Flag Blue accent text
    margin: 0,
  }
};

export default LoadingMessage;
