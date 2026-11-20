import styled from 'styled-components';

import { ContentContainer } from '../../styled_components';
import { NavBar, Footer } from '../';
import { useTranslation, Trans } from 'react-i18next';

const ErrorPage = styled.div`
  background:white;
  min-height:100vh;
  text-align:center;
  img.errorImg {
    padding:60px;
  }
`

const Error = () => {
  const { t } = useTranslation('common');

  return (
    <ErrorPage >
      <NavBar/>
      <ContentContainer>
        <h1>{t('errorPage.title')}</h1>
        <h2>{t('errorPage.subtitle')}</h2>
        <p>
          <Trans t={t} i18nKey="errorPage.body" />
        </p>
      </ContentContainer>
      <Footer/>
    </ErrorPage>
  );
}

export default Error;
