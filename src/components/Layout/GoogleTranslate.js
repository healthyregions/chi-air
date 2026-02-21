import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectLocale} from "../../store/slices/sensorDataSlice";

const GoogleTranslateContainer = styled.div`
  position: fixed;
  bottom:0;
  left: 0.5em;   //same left margin as the Nav Menu
  z-index: 1000;
  background-color: rgba(255,255,255,0.75);
  padding: 15px; //same padding as the Nav Menu
`;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const GoogleTranslate = () => {
  const locale = useSelector(selectLocale);

  const previous = usePrevious({ locale });
  const ref = useRef(null);

  useEffect(() => {
    console.log(`Component whole mounted`);
    if (previous?.locale !== locale) {
      ref.current = null;
    }

    if (!ref?.current) {
      console.log(`Component ref mounted`);
      ref.current = document.createElement("script");
      ref.current.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      ref.current.async = true;
      document.body.appendChild(ref.current);
      window.googleTranslateElementInit = () => new window.google.translate.TranslateElement({
        pageLanguage: locale,
        includedLanguages: "en,es",
        autoDisplay: false,
      }, "google_translate_element");
    }

    return () => ref.current = null;
  }, [locale]);

  return (
    <GoogleTranslateContainer
      key={locale}
      ref={ref}
      id="google_translate_element"
      style={{
        bottom: window.location.pathname.indexOf("map") > -1
          ?  "4em"  //if on map page, move up to avoid overlapping with map controls
          : "0.5em"
      }}
    ></GoogleTranslateContainer>
  );
}

export default GoogleTranslate;
