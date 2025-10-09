import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../config";

const FooterContainer = styled.footer`
  display:flex;
  justify-content: center;
  width: 100%;
  background: ${colors.chicagoDarkBlue};
  p {
    color: ${colors.black};
    font-size: 1rem;
  }
  h6 {
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${colors.black};
    text-align:left;
  }
  a {
    text-decoration: none;
    color: ${colors.black};
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  img {
    margin-bottom: 10px;
    @media (max-width: 960px) {
      max-width: 50%;
      display: block;
      margin: 40px auto;
    }
  }
  img.logo {
    margin: 0 auto 2rem 0;
    display: block;

    width: 18rem;
    max-height: 4rem;
    @media (max-width: 900px) {
      margin: 2rem auto;
      max-width: 35%;
    }
    &.depaul {
      margin: auto 4rem;
      width: 8rem;
      max-height: 8rem;
    }
  }
  hr {
    margin: 20px 0;
    color:white;
    border-bottom:1px solid white;
  }
  h6 {
    color: white;
    font-size: 2rem;
    font-family: "Lora", serif;
  }
  ul li a {
    color: white;
    text-decoration: underline;
  }
`;
const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 2rem 0;
  a, a img {
    display: inline-block;
    width:90%;
  }
  ul {
    list-style: none;
    li {
      line-height: 1.5;
      color: white;
      font-weight: bold;
      display: inline-block;
      margin-right: 2em;
    }
    li:last-child {
    margin-right: 0}
  }
`;

const Footer = (props) => {
  return (
    <FooterContainer>
      <FooterContent>
        <h6 translate="no">Chi Air</h6>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/map">Map</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
