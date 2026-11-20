import styled from 'styled-components';
import { ContentContainer } from '../../styled_components';
import { colors } from '../../config';
import { useTranslation } from 'react-i18next';

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

const LoadingMessage = () => {
    const { t } = useTranslation('common');

    return (
       <PreloaderPage>
           <ContentContainer className="transferInfo">
                <h2>{t('loading.message')}</h2>
                <img src={`${process.env.PUBLIC_URL}/assets/img/preloader.gif`} alt={t('loading.imageAlt')} />
           </ContentContainer>
       </PreloaderPage>
    );
}

export default LoadingMessage;
