import {useEffect} from "react";
import styled from "styled-components";
// import {useSelector} from "react-redux";
// import {selectLocale} from "../../store/slices/sensorDataSlice";

const GoogleTranslateContainer = styled.div`
  position: fixed;
  bottom:0;
  left: 0.5em;   //same left margin as the Nav Menu
  z-index: 1000;
  background-color: rgba(255,255,255,0.75);
  padding: 15px; //same padding as the Nav Menu
`;

// Based on https://codesandbox.io/p/sandbox/google-translate-in-react-js-qzdjj
export const GoogleTranslate = () => {
  //const locale = useSelector(selectLocale);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        //includedLanguages: "en,es",
        autoDisplay: false
      },
      "google_translate_element"
    );
  };
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);
  return (
    <GoogleTranslateContainer
      id="google_translate_element"
      style={{
        bottom: window.location.pathname.indexOf("map") > -1
          ?  "4em"  //if on map page, move up to avoid overlapping with map controls
          : "0.5em"
      }}
    ></GoogleTranslateContainer>
  );
}
