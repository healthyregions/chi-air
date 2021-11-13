import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';

import { StaticNavbar, Footer } from '../../components';
import { colors } from '../../config';
import { Gutter } from '../../styled_components';
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import onion from './onion.png'


const HomePage = styled.div`
    h1 {    
        font-family: 'Lora', serif;
        font-size: 4rem;
        font-weight: 300;
        text-align: left;
        color: ${colors.black};
        width: 80vw;
        max-width: 940px;
        margin: 0 0 40px 0;
    }
    .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
        margin-bottom: .5rem;
        font-weight: 500;
        line-height: 1.2;
    }
    hr {
        max-width:1140px;
        margin:6em auto;
        border: 0;
        border-top: 1px solid ${colors.darkgray};
    } 
    p {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: ${colors.darkgray};
    }
     .photo {
      width: 100%;

    }
    a {
        color: ${colors.chicagoBlue};
    }
`

const HomePageContent = styled.div`
    width:100%;
    margin:0 auto;
`

const Hero = styled.div`
    width:100%;
    max-width:1140px;
    text-align:center;
    color: ${colors.lightgray};
    margin:0 auto;
    padding:50px 10px 0 10px;
    p {
        
        font-family: 'Lora', sans-serif;
        font-size: 1.25rem;
        font-stretch: normal;
        text-align:left;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: normal;
        padding:2rem 0;
    }
    #button-cta {
        font-family: 'Lora', serif;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1.75px;
        line-height:5;
        text-align: center;
        background-color: #FFFFFF ;
        color: ${colors.darkgray};
        padding: 1rem 1.5rem;
        margin:1rem;
        // border-radius: .3rem;
        text-decoration:none;
    }

    #button-search{
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 1.75px;
        line-height:5;
        text-align: center;
        text-transform:uppercase;
        background-color: ${colors.darkgray};
        color: #FFFFFF;
        padding: 1rem 1.5rem;
        margin:1rem;
        // border-radius: .3rem;
        text-decoration:none;
    }

    .small-text {
        font-size:0.75rem;
        a {
            font-size:0.75rem;
            color:${colors.orange};
            text-decoration:none;
        }
    }
    video {
        margin-bottom:20px;
        width:100%;
        max-width:600px;
    }
    .map-caption {
        font-size:0.9rem;
        text-align:left;

    }

`


export default function Home(){
    return (
       <HomePage>
           <StaticNavbar/>
           <HomePageContent>
                <Hero>

                            <h1>Uncover the nature of Chicago's environment.</h1>
                            <p>
                                Chicago's urban environment has profound impacts on the health of communities and individuals. 
                                A handful of key metrics―tree cover, air pollution estimates, heat island effects, traffic volumes, and social vulnerability index―
                                help to reveal where in the city people face particular challenges as we work towards a healthier Chicago.
                            </p>

                                <br/> 
                                <NavLink to="/map" id="button-cta">Explore Chicago's Environment --> </NavLink>
                                <NavLink to="/map" id="button-search">Enter an Address to Start</NavLink><br/>





                            
                <Grid container spacing ={2}>
                        <Grid item xs={4}> 
                            <Grid item> 
                                <img className="photo" src={onion} alt="Wild Onion" loading="lazy"/>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}> 
                            <Grid item> 

                    <br/><br/>

                            <p> Like the <a href="">wild onion</a> that Chicago was named for, data about the city's environment should 
                        be <b>tasty</b> and <b>plentiful</b>. By tasty, we mean easily accessible and ready to use and explore. By plentiful,
                        we mean the data should extend across multiple dimensions of the city's landscape, and be updated regularly. 
                            <br/><br/>
                        We <a href="">harmonize & standardize</a> environmental data across dozens of sources to make it accessible for full exploration, alongside a growing list of 
                        resources on the Chicago Environment, cultivated by a community of curators.
                            <br/><br/>
                            This project refactors data from the a <a href="">previous partnership</a> with the City, and gets customized
                        as a new opensource platform for the wider community. <br/><br/>

                            Have data to add? A mapping resource to recommend? <a href="">We invite you</a> to add more resources to the <i>ChiVes</i> explorer as build out
                        an open data coalition to prepare Chicago for a more resilient future! </p>

                           <h5>Image of <i>Wild Onion, Allium acuminatum </i> by Margaret Neilson Armstrong (1913) via <br/> 
                           Creative Commons CC0 1.0 Universal Public Domain Dedication.</h5>

                            </Grid>
                        </Grid>
                    </Grid>

                    <br/><br/>
       
                    <Gutter h={20}/>



                </Hero>




           </HomePageContent>
           <Footer signUp={false} />
       </HomePage>
    );
}