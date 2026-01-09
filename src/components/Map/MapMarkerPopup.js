import {ContentContainer} from "../../styled_components";
import MapMarkerPin from "./MapMarkerPin";
import styled from "styled-components";

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`;
const PopupTitle = styled.h2`
    font-family: Roboto,sans-serif !important;
    font-size: 2rem !important;
    margin-bottom: 0 !important;
`;
const PopupSubtitle = styled.h4`
    font-family: Roboto,sans-serif !important;
    font-size: 1rem !important;
    color: #E83F6F !important;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
`;
const PopupBody = styled.p`
    font-family: Lora,sans-serif !important;
    font-size: 1rem !important;
    letter-spacing: 0 !important;
    p {
        line-height: 1.25;
    }
`;

// This component handles and formats the map tooltip info regarding the clicked Community Sticker.
// The props passed to this component should contain a reference to the Sticker that was clicked
const MapMarkerPopup = ({ sticker }) => {
    return (
        <>
            {sticker && <>
                <ContentContainer style={{ padding: '1em 2em 0' }}>
                    <FlexRow className={'flex-row'}>
                        <MapMarkerPin size={60} clickable={false} imgSrc={sticker?.logo} imgAlt={sticker?.title} />
                        <FlexCol>
                            <PopupTitle>{sticker?.title}</PopupTitle>
                            <PopupSubtitle>{sticker?.subtitle}</PopupSubtitle>

                        </FlexCol>
                    </FlexRow>

                    <PopupBody>
                      Monitors: {sticker?.pm25 && 'PM2.5'}  {sticker?.no2 && 'NO2'}
                    </PopupBody>
                </ContentContainer>
            </>}
        </>
    )
}

export default MapMarkerPopup;
