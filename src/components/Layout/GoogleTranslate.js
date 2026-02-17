import { useEffect } from "react";

const GoogleTranslateContainer = styled.div`
  position: fixed;
  left: 0.5em;   //same left margin as the Nav Menu
  z-index: 1000;
  background-color: rgba(255,255,255,0.75);
  padding: 15px; //same padding as the Nav Menu
`;

/** Google Translation Widget */
const googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      autoDisplay: false,
    },
    "google_translate_element"
  );
};

const GoogleTranslate = ({ }) => {
  useEffect(() => {
    var addScript = document.createElement("script");
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
      style={
        location.pathname.indexOf("map") > -1
          ? { bottom: "4em" } //if on map page, move up to avoid overlapping with map controls
          : { bottom: "0.5em" }
      }
    ></GoogleTranslateContainer>
  );
}

export default GoogleTranslate;
