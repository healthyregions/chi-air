import {FaHistory} from "@react-icons/all-files/fa/FaHistory";


export const LastUpdatedDisplay = ({ date }) => {
  return (
    <div style={{ margin: '0.5rem 0' }}>
      <span style={{ fontWeight: 200, fontFamily: 'Space Grotesk' }}>
        <FaHistory style={{ transform: 'scaleX(-1)', color: 'rgba(0, 88, 153, 0.5)', marginRight: '0.35rem' }} />
        <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', marginRight: '0.25rem' }}>updat{date?.time ? 'ed' : 'ing'}</span>
        {date?.time || 'Loading'}, {date?.date || 'Please Wait...'}
      </span>
    </div>
  );
};
