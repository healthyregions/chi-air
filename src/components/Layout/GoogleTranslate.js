import {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectLocale} from "../../store/slices/sensorDataSlice";
import {useCookies} from "react-cookie";
import {locales} from "../VariablePanel/common";

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

// Based on https://codesandbox.io/p/sandbox/google-translate-in-react-js-qzdjj
export const GoogleTranslate = () => {
  const locale = useSelector(selectLocale);

  const [/*cookies*/, setCookie, removeCookie] = useCookies(['googtrans'], {
    doNotParse: true,
  });

  const previous = usePrevious(locale);
  const [loaded, setLoaded] = useState(false);

  const googleTranslateElementInit = useCallback(() => {
    new window.google.translate.TranslateElement(
      {
        //pageLanguage: "en",
        includedLanguages: locales?.map(l => l.value)?.join(','),   // e.g.  "en,es,pl,zh-CN",
        autoDisplay: true
      },
      "google_translate_element"
    );
  }, []);

  // Based on https://stackoverflow.com/a/7762508
  useEffect(() => {
    if (!loaded) { console.log('locale loading.');return; }
    if (locale === previous) { console.log('locale unchanged.');return; }

    console.log('Setting locale to: ', locale);

    if (!locale || locale === 'auto') {
      // FIXME: removeCookie does not appear to work in Safari
      removeCookie('googtrans', { path: '/' });
    } else {
      setCookie('googtrans', `/auto/${locale}`, { path: '/' })
    }

    setTimeout(() => {
      window.location.reload();
    }, 300)
  }, [locale, loaded, previous, removeCookie, setCookie]);

  // Prevent auto-translation before text contents are fully loaded
  useEffect(() => {
    setLoaded(true);
  }, []);

  // After loading, add the translation widget
  useEffect(() => {
    if (!loaded) { return; }

    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [loaded, googleTranslateElementInit]);

  return (
    <GoogleTranslateContainer
      className="notranslate"
      id="google_translate_element"
      style={{
        display: 'none',
        bottom: window.location.pathname.indexOf("map") > -1
          ?  "4em"  //if on map page, move up to avoid overlapping with map controls
          : "0.5em"
      }}
    ></GoogleTranslateContainer>
  );
}
