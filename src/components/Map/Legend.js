import Grid from '@mui/material/Grid';
import styled from 'styled-components';

import {variablePresets} from '../../config';
import {useChivesData} from "../../hooks/useChivesData";
import {useSelector} from "react-redux";
import {selectMapParams} from "../../store/slices/legacyStoreSlice";
// import { Gutter } from '../styled_components';
// import Tooltip from './tooltip';

const BottomPanel = styled.div`

`

const LegendContainer = styled.div`
    width:100%;
    margin:0;
    box-sizing: border-box;
    div.MuiGrid-item {
        padding-top:0;
    }
`


const LegendTitle = styled.h3`
    text-align: center;
    font-family:'Lexend', sans-serif;
    font-weight: 500;
    font-size: 16px;
    padding:0;
    margin:0;
`

const BinLabels = styled.div`
    width:110%;
    display: flex;
    margin-top:0px;
    box-sizing: border-box;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-left: -1.8rem;
    margin-right: 0;
  
    .bin { 
        height:10px;
        display: inline;
        border:0;
        margin:0;
        flex:2;
        font-size:10px;
        text-align: center;
    }
    .bin:nth-of-type(1) {
        transform: ${props => props.firstBinZero ? 'translateX(-45%)' : 'none'};
    }
    .tooltipText {
        margin-top:-5px;
        padding-bottom:25px;
    }
`
const BinBars = styled.div`
    margin-top:3px;
    box-sizing: border-box;
    .color-bars {
        width:100%;
        display: flex;
    }
    .color-bars.with-labels {
        margin-bottom: 5px;
    }
    .bin {
        height:5px;
        display: inline;
        flex:1;
        border:0;
        margin:0;
    }
    .bin.min { 
        max-width: 1px;
    }
    .bin.max { 
        max-width: 1px;
        translate: -20px;
    }
    .bin > .label {
        font-size:10px;
        translate: -50%;
        margin-top: 5px;
        text-align: center;
    }
    .bin:nth-of-type(1) {
        transform: ${props => props.firstBinZero ? 'scaleX(0.35)' : 'none'};
    }
`

const BinLabel = ({ label }) => {
    switch(label.trim()) {
        case "Historical Redlining":
            return (
                <BinLabels>
                    <div key={'color-label0'} className='bin labe'>{"A"}</div>
                    <div key={'color-label1'} className='bin labe'>{"B"}</div>
                    <div key={'color-label2'} className='bin labe'>{"C"}</div>
                    <div key={'color-label3'} className='bin labe'>{"D"}</div>
                </BinLabels>
            );
        case "Displacement Pressure":
            return (
                <BinLabels>
                    <div key={'color-label0'} className='bin labe'>{"Not Vulnerable"}</div>
                    <div key={'color-label1'} className='bin labe'>{"Vulnerable, Prices Not Rising"}</div>
                    <div key={'color-label2'} className='bin labe'>{"Vulnerable, Prices Rising"}</div>
                </BinLabels>
            );
        default:
            return null
    }
}

const Legend = ({
  precision = 2
}) => {
  const { storedGeojson } = useChivesData();
  const mapParams = useSelector(selectMapParams);

  // Note that "label" above and variableName here are similar, but not always the same
  const columnName = mapParams.variableName ? variablePresets[mapParams.variableName].Column : '';

  const values = storedGeojson?.features?.map(f => f.properties[columnName]) || [];

  const min = Math.min(...values.filter(v => Number(v) && !Number.isNaN(v)));
  const max = Math.max(...values.filter(v => Number(v) && !Number.isNaN(v)));

  const label = `${mapParams.variableName} ${mapParams?.units || ""}`;
  const categorical = ["Historical Redlining", "Displacement Pressure"].includes(label.trim());

  const bins = mapParams?.bins || mapParams?.Bins;
  const colorScale = mapParams.colorScale;

  const lowerBounds = colorScale.slice(0, colorScale?.length - 2).map((c, i) => Math.round(bins[i - 1] * 100) / 100);
  const upperBounds = colorScale.slice(1, colorScale?.length - 1).map((c, i) => Math.round(bins[i - 1] * 100) / 100);

  return (
    <>
      <BottomPanel style={{ marginTop: '1rem' }}>
        <LegendContainer>
          <Grid container spacing={0} id='legend-bins-container'>
            <Grid size={{ xs: 12 }}>
              <LegendTitle>
                {label || ''}
              </LegendTitle>
            </Grid>
            <Grid size={{ xs: 12 }}>
              {!!colorScale && !categorical &&
                <BinBars>
                  <div className="color-bars with-labels">
                    <div className="bin min">
                      <div className="label">{min.toFixed(precision || 2)}</div>
                    </div>
                    {colorScale.map((color, i) =>
                      <div key={'color-bar' + i} className="bin color"
                           style={{backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`}}>
                        {i > 0 && <div className="label">{Math.round(bins[i - 1] * 100) / 100}</div>}
                      </div>
                    )}
                    <div className="bin max">
                      <div className="label">{max.toFixed(precision || 2)}</div>
                    </div>
                  </div>
                </BinBars>
              }
              {!!colorScale && categorical && <>
                <BinBars style={{ display: 'flex' }}>
                  <div className="color-bars" style={{ flexDirection: 'column' }}>
                    {colorScale.map((color, i) =>
                      <div key={'color-bar' + i} className="bin color"
                           style={{backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`}}>
                        {lowerBounds[i]} - {upperBounds[i]}
                      </div>)}
                    <BinLabel label={label}></BinLabel>
                  </div>
                </BinBars>
              </>}
            </Grid>
          </Grid>
        </LegendContainer>
      </BottomPanel>
    </>
  )
}

export default Legend
