// AQIColorScale.js
import {pm2_5ColorMap} from "../../config";

const AQIColorScale = () => {
  return (
    <div>
      { Object.entries(pm2_5ColorMap).map(([key, color], index) => (
        <div key={`${key}-${index}`} style={{ display: "flex", margin:'.25em 0' }}>
            <span
              key={`overlay-key-${key}-${color}`}
              style={{
                backgroundColor: `rgb(${color.join(",")})`,
                width: 16,
                height: 16,
              }}
            ></span>
          <span style={{padding:0, margin:'0 0 0 .25em'}}>{key}</span>
        </div>
      ))}
    </div>
  );
}

export default AQIColorScale;
