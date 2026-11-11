import { useDispatch } from 'react-redux';
import {NavLink, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../config';
import Grid from "@mui/material/Grid";
import {DropdownButton} from "../VariablePanel/DropdownButton";
import {MdArrowOutward, MdHomeFilled, MdOutlineTranslate} from "react-icons/md";
import useMediaQuery from "@mui/material/useMediaQuery";
import {setLocale} from "../../store/slices/sensorDataSlice";
import {useCookies} from "react-cookie";
import {getLocaleLabel, LButton, locales, productName} from "../VariablePanel/common";
import {useState} from "react";
import {FaCaretDown} from "react-icons/fa";
import {FaArrowDown} from "@react-icons/all-files/fa/FaArrowDown";
import Button from "@mui/material/Button";
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose";
import {AiOutlineMenu} from "@react-icons/all-files/ai/AiOutlineMenu";
import {FaArrowUp} from "@react-icons/all-files/fa/FaArrowUp";
import {FaCaretUp} from "@react-icons/all-files/fa/FaCaretUp";

const NavContainer = styled.div`
  padding: ${({ $asFooter, $largeScreen }) => $largeScreen ? `4rem 6rem ${$asFooter ? '4rem' : 0} 6rem` : '0'};
  top:.5em;
  left:.5em;
  z-index: 500;
  button {
    padding-top: 5px;
    padding-right: 15px;
    padding-bottom: 5px;
    padding-left: 15px;
    //border: 1px solid ${colors.chicagoBlue};
  }
`;

const ContentContainer = styled.div`
    max-width: 1200px; /* Standard container width */
    margin: 0 auto;    /* Centering the container */
    padding: ${({ $largeScreen }) => $largeScreen ? '0 2rem' : '0'}; /* Prevents text from touching edges on larger screens */
    width: 100%;
    box-sizing: border-box;
`;

type NavLinkType = {
  title: string;
  url: string;
  target?: string;
  subitem?: boolean;
};
type Props = {
  title: string;
  dropdownElId: string;
  items: NavLinkType[];
  directLink?: string;
};
function NavDropdownButton({ title, dropdownElId, items, directLink, dropup=false, style={} }: Props) {
  return (
    <div style={{ display: 'inline-flex' }}>
      <LButton
        disableRipple
        id={`${dropdownElId}-btn`}
        style={style}
        sx={{'&:hover': {backgroundColor: '#00000000'}}}
        onMouseLeave={() => {
          document.getElementById(dropdownElId).setAttribute("hidden", "");
        }}
        onMouseEnter={() => {
          document.getElementById(dropdownElId).removeAttribute("hidden");
        }}
        onClick={() => {
          if (directLink) window.location.href = directLink;
        }}
      >
        {title} {dropup ? <FaCaretUp style={{height:".9em"}} /> : <FaCaretDown style={{height:".9em"}} />}
      </LButton>
      <div
        onMouseEnter={() => {
          document.getElementById(dropdownElId).removeAttribute("hidden");
        }}
        onMouseLeave={() => {
          document.getElementById(dropdownElId).setAttribute("hidden", "");
        }}
        style={{
          backgroundColor: '#ffffff',
          padding:0,
          marginTop: dropup ? '' : '50px',
          top: dropup ? '' : 'auto',
          bottom: dropup ? '116px' : '',
          position: 'absolute',
          left: 'auto',
          borderRadius: '8px',
          boxShadow: dropup ? '2px 2px 4px 0px #1E1E1E0D' : '2px 2px 4px 0px #1E1E1E0D',
           zIndex: 20,
        }}>
          <ul
            id={dropdownElId}
            type={'none'}
            style={{
              ...style,
              background: dropup ? 'linear-gradient(180deg, rgba(65, 182, 230, 0.25) 0%, rgba(255, 255, 255, 0.25) 100%)' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(65, 182, 230, 0.25) 100%)',
              color: colors.chicagoDarkBlue,
              fontSize: '24px',
              border: 'none',
              margin: 0,
              padding: '16px 0',
            }}
            hidden
          >
            {items.map((item, index) => (
              <li key={index} style={{ padding: '8px 19px' }}
                  onMouseEnter={() => {
                    document.getElementById(dropdownElId).removeAttribute("hidden");
                  }}
                  onMouseLeave={() => {
                    document.getElementById(dropdownElId).setAttribute("hidden", "");
                  }}>
                <NavLink to={item.url} target={item.target || ''} style={{ textDecoration: 'none', color: colors.chicagoDarkBlue, fontFamily: 'Space Grotesk, serif' }}>
                <span>
                  {item.subitem && (dropup ? <FaArrowUp style={{height:".9em"}} /> : <FaArrowDown style={{height:".9em"}} />) }
                </span>
                  {item.title}
                  {item.target === "_blank" && <MdArrowOutward style={{height:".75em"}} />}</NavLink>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}

function NavDropdownMobile({ title, dropdownElId, items, style={} }: Props) {
  return (
    <>
      <LButton
        disableRipple
        fullWidth
        style={{ ...style, textAlign: 'center', position: 'static', padding: '16px 0', width: '100%' }}
        className={'text-uppercase'}
        onClick={() => {
          document.getElementById(dropdownElId).toggleAttribute("hidden");
        }}
      >
        {title} <FaCaretDown />
      </LButton>
      <ul id={dropdownElId} type={'none'} style={{
        ...style,
        textAlign: 'center',
        backgroundColor: colors.chicagoDarkBlue,
      }} hidden>
        {items.map((item, index) => (
          <>
            {index > 0 && <>
              <hr/>
            </>}
            <li key={index} style={{ padding: '16px 0' }}>
              <NavLink
                className={"text-white no-underline text-base"}
                to={item.url}
                style={{ ...style, textDecoration: 'none', color: colors.white, fontFamily: 'Lexend', width: '100%' }}
              >
                {item.subitem && <FaArrowDown style={{ marginLeft: '0.25rem' }} />}{item.title}
              </NavLink>
            </li>
          </>
        ))}
      </ul>
    </>
  );
}

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    color: ${colors.chicagoDarkBlue};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NavBar = ({ asFooter=false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 600px)');
  const [cookies] = useCookies(['googtrans']);

  const onLocaleChange = (locale) => {
    dispatch(setLocale(locale));
  };
  const [nav, setNav] = useState(false);
  //const [navBackgroundColor, setNavBackgroundColor] = useState("transparent");

  const handleNav = () => {
    setNav(!nav);
  };

  // useEffect(() => {
  //   const changeBackgroundColor = () => {
  //     if (window.scrollY >= 90) {
  //       setNavBackgroundColor("salmonpink");
  //     } else {
  //       setNavBackgroundColor("transparent");
  //     }
  //   };
  //   window.addEventListener("scroll", changeBackgroundColor);
  // }, []);

  const aboutItems = [
    { title: "Team", url: "/team" },
    { title: "Info & FAQ", url: "/about" },
    { title: "Contact Us", url: "/contact" },
  ];

  const mapsAndMoreItems = [
    { title: `${productName} Map`, url: "/map" },
    { title: "All Resources", url: "/resources" },
  ];

  const lgScreenFontSize = '24px';
  const xsScreenFontSize = '16px'
  const fontSize = largeScreen ? lgScreenFontSize : xsScreenFontSize;



  // TODO: Translate tailwind -> CSS via styled component
  return (
    <>
      <NavContainer $asFooter={asFooter} $largeScreen={largeScreen}>
        <ContentContainer $largeScreen={largeScreen}>
          {largeScreen && <Grid container justifyContent={largeScreen ? 'space-between' : 'center'} alignItems={'center'}
                flexDirection={largeScreen ? 'row' : 'column-reverse'}>
            <Grid size='grow'>
              <Grid spacing={2} container justifyContent={largeScreen ? 'initial' : 'center'} alignItems={'center'}>
                <DropdownButton style={{fontSize}} ButtonComponent={LButton} icon={<MdOutlineTranslate/>}
                                label={getLocaleLabel(cookies['googtrans'])} options={locales} onChange={onLocaleChange}
                                dropup={asFooter} />
                <LButton disableRipple sx={{'&:hover': {backgroundColor: '#00000000'}}} style={{fontSize}}
                         onClick={() => navigate('/')}><MdHomeFilled/></LButton>
                <NavDropdownButton dropdownElId={`maps-dd${asFooter ? '-footer' : ''}`} title={'Maps & more'} items={mapsAndMoreItems}
                                   style={{fontSize}} dropup={asFooter} />
                <NavDropdownButton dropdownElId={`about-dd${asFooter ? '-footer' : ''}`} title={'About'} items={aboutItems}
                                   style={{fontSize}} dropup={asFooter} />
              </Grid>
            </Grid>
            <Grid alignItems={'end'} justifyContent={'right'}
                  style={{cursor: largeScreen ? '' : 'pointer', padding: largeScreen ? '' : '2rem 4rem'}}>
              <img width={largeScreen ? 400 : '100%'} style={{minWidth: largeScreen ? '' : '8rem'}}
                   src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'}/>
            </Grid>
          </Grid>}

          {/* Mobile Button */}
          {!largeScreen && <>
            <Button disableRipple style={{ display: 'block', left: 0, padding: '30px', zIndex: 100, top: 0 }}
              onClick={handleNav}
              //className="block min-[940px]:hidden pl-[25px] z-50"
             >
              <AiOutlineClose size={35} color={"#444444"} style={{ transition: 'all 0.6s fade-in', transitionDelay: '0.3s', position: 'fixed' }} opacity={nav ? 1 : 0} top={0} left={0} />
              <AiOutlineMenu size={35} color={"#444444"} style={{ transition: 'all 0.6s fade-in', transitionDelay: '0.3s', position: 'fixed' }} opacity={nav ? 0 : 1} top={0} left={0} />
            </Button>

            {/* Mobile Menu */}
            <Grid style={{ transition: 'all 0.3s ease-in-out' }} backgroundColor={colors.chicagoLightBlue} zIndex={50} position={'fixed'} left={0} top={nav ? 0 : '-100%'} bottom={0} justifyContent={'center'} width={'100%'} alignItems={'baseline'} paddingTop={'50px'} height={'100vh'}
              // className={`absolute ${
              //   nav ? "left-0" : "left-[-100%]"
              // } top-0 bottom-0 right-0 pt-100 flex justify-center items-baseline w-full
              // h-screen bg-frenchviolet ease-in duration-300 `}
            >
              <ul style={{ textAlign: 'center', fontFamily: 'Lexend' }}>
                <li>
                  <StyledNavLink to="/" onClick={handleNav}>
                    <img width={'100%'} style={{ textDecoration:'none', padding: '2rem' }}
                         src={'/icons/chiair-logo.svg'} alt={'Chicago Air Quality'}/>
                  </StyledNavLink>
                </li>

                <li style={{ padding: '16px 32px' }}>
                  <StyledNavLink to={'/'} style={{ fontSize }} onClick={handleNav}>
                    <MdHomeFilled style={{ marginRight: '0.25rem' }} /> Home
                  </StyledNavLink>
                </li>

                {/* Resources Menu */}
                <li>
                  <NavDropdownMobile
                    style={{ fontSize }}
                    title="Maps & more"
                    dropdownElId="maps-dd-mobile"
                    items={mapsAndMoreItems}
                  />
                </li>

                {/* About Menu */}
                <li>
                  <NavDropdownMobile
                    style={{ fontSize }}
                    title="About"
                    dropdownElId="about-dd-mobile"
                    items={aboutItems}
                  />
                </li>

                <li>
                  <DropdownButton style={{fontSize}} ButtonComponent={LButton} icon={<MdOutlineTranslate/>}
                                  label={getLocaleLabel(cookies['googtrans'])} options={locales} onChange={onLocaleChange}
                                  dropup={false} />
                </li>
              </ul>
            </Grid>
          </>}
        </ContentContainer>
      </NavContainer>

    </>

    // <Grid container position={'absolute'} left={0} top={0} zIndex={50} width={'100%'} flexDirection={largeScreen ? 'row' : 'column'}
    //   //className={`absolute left-0 top-0 w-full z-50 ease-in duration-300 bg-${navBackgroundColor}`}
    // >
    //   <Grid justifyContent={'space-between'} alignItems={'center'} marginTop={8} paddingX={0} marginX={'auto'}
    //     //className={`flex justify-between items-center 2xl:max-w-[1536px] mt-8 pl-0 pr-0 mx-auto`}
    //   >
    //     {largeScreen && <ul className="navbar hidden min-[940px]:flex pl-[2.5%]">
    //       { location.pathname !== "/" && <li className={'p-0 pt-2 mr-6'}>
    //         <NavLink to="/" style={{ padding:0, margin:0 }}>
    //           <img width={40} height={40} src={'/logos/sdoh-logo-navbar-desktop.svg'} alt={'LOGO'} />
    //         </NavLink>
    //       </li>
    //       }
    //
    //       {/* Translate Dropdown */}
    //       {/*<li className={`mt-4 ${location.pathname === "/" ? "active" : ""}`}>*/}
    //       {/*  <DropdownButton />*/}
    //       {/*</li>*/}
    //
    //       {/* Home Link */}
    //       <li className={`mt-4 ${location.pathname === "/" ? "active" : ""}`}>
    //         <NavLink to="/">Home</NavLink>
    //       </li>
    //
    //       {/* Maps & more Menu */}
    //       <li
    //         className={`mt-4 ml-4 ${
    //           location.pathname.startsWith("/maps") ||
    //           location.pathname.startsWith("/resources")
    //             ? "active"
    //             : ""
    //         }`}
    //       >
    //         <NavDropdownButton
    //           title="Maps & more"
    //           dropdownElId="maps-dd"
    //           items={mapsAndMoreItems}
    //         />
    //       </li>
    //       {/* About Menu */}
    //       <li
    //         className={`mt-4 ml-4 ${
    //           location.pathname.startsWith("/about") ||
    //           location.pathname.startsWith("/team") ||
    //           location.pathname.startsWith("/contact")
    //             ? "active"
    //             : ""
    //         }`}
    //       >
    //         <NavDropdownButton
    //           title="About"
    //           dropdownElId="about-dd"
    //           items={aboutItems}
    //         />
    //       </li>
    //
    //       {/* Contact Us Link */}
    //       <li
    //         className={`mt-4 ml-4 ${
    //           location.pathname.startsWith("/contact") ? "active" : ""
    //         }`}
    //       >
    //         <NavLink to="/contact">Contact Us</NavLink>
    //       </li>
    //     </ul>}
    //
    //     {/* Mobile Button */}
    //     {!largeScreen && <>
    //       <div
    //         onClick={handleNav}
    //         className="block min-[940px]:hidden pl-[25px] z-50"
    //       >
    //         {nav ? (
    //           <AiOutlineClose size={35} color={"white"} className={'animate-fade-in'} />
    //         ) : (
    //           <AiOutlineMenu size={35} className={'animate-fade-in'} />
    //         )}
    //       </div>
    //
    //       {/* Mobile Menu */}
    //       <div
    //         className={`min-[940px]:hidden absolute ${
    //           nav ? "left-0" : "left-[-100%]"
    //         } top-0 bottom-0 right-0 pt-100 flex justify-center items-baseline w-full
    //         h-screen bg-frenchviolet ease-in duration-300 `}
    //       >
    //         <ul className="navbar-mobile">
    //           <li>
    //             <NavLink to="/">
    //               <img width={150} height={75} src={'./logos/sdoh-logo-navbar-mobile.svg'} alt={'LOGO'} />
    //             </NavLink>
    //           </li>
    //
    //           {/* Resources Menu */}
    //           <li>
    //             <NavDropdownMobile
    //               title="Maps & more"
    //               dropdownElId="maps-dd-mobile"
    //               items={mapsAndMoreItems}
    //             />
    //           </li>
    //
    //           {/* About Menu */}
    //           <li>
    //             <NavDropdownMobile
    //               title="About"
    //               dropdownElId="about-dd-mobile"
    //               items={aboutItems}
    //             />
    //           </li>
    //
    //           {/* Contact Us Link */}
    //           <li className={'text-uppercase'}>
    //             <NavLink to="/contact">Contact Us</NavLink>
    //           </li>
    //         </ul>
    //       </div>
    //     </>}
    //   </Grid>
    // </Grid>
  );
};
export default NavBar;
