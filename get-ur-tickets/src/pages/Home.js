import React, { useState, useEffect } from 'react';
import MyButton from "../Components/MyButton";
import Fly_Now from "../Pictures/Fly_Now.png";
import DetailsPopover from "../Components/popOver.tsx";
import { Tickets, chkMore, chkLess } from "../Components/TicketGenerator.js"
import { Authenticator, Flex } from '@aws-amplify/ui-react';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { Contact } from './Contact Us.js';
import ProfilePic from '../Pictures/BlankProfile.png'


import SearchBar from '../Components/SearchBar.js';
import { Button } from 'bootstrap';

const UserBanner = () => {
  return (
      <Authenticator>
          {({ user }) => (
              <div className="Nav-Banner">
                  <h1 className="Word-Color">Welcome, {user.username}!</h1>
              </div>
          )}
      </Authenticator>
  );
};

export default UserBanner;



export function Home(){

  /* Search Bar Start */
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results); // Update the search results state with API response
  };
    
  /* Search Bar End */

  const [data, setData] = useState()
  const [tracking, setTracking] = useState(0)
  const [hold, setHold] = useState([])
  const [noResult, setnoResult] = useState(false)
  const [obj, setObj] = useState(new Tickets)
  const [item, setItem] = useState([])
  const [chkPageProg, setChkPageProg] = useState(false)
  const [chkPrevProg, setChkPrevProg] = useState(false)
  const [MoreOrLess, setMoreOrLess] = useState(1)  //using 1 to show more and 2 to show less. anything else is an error

  useEffect(() => {
    fetch('data/test3.json').then(
        response => {
          if(response.ok){
            console.log(response);
            return response.json();
          }
          else{
            console.log("not ok");
          }
      }
    ).then(
        data => {
          setData(data);
          var temp = data;
          setHold(temp);
        },
    )
  }, []);


    const [showButton, setShowButton] = useState(true);
    const toggleButton = () => {
        setShowButton(!showButton);
    };


    //function a is used when someone presses see more or see less hyperlink. Calculates what the tracking variable needs to be to be passed into getTickets function
    const a = (obj, pageChangeChk) => {
      console.log('inside a')
      if(pageChangeChk === 1){
        console.log('inside see more')
        var needthis = (parseInt(tracking) + 5);
        console.log(hold.length + " CHECK " + needthis )
        if(needthis >= hold.length && tracking !== 0){
          needthis -= needthis - hold.length;
          setTracking(needthis);
          console.log(hold.length + " in home " + tracking);
          setMoreOrLess(1);
        } 
        else if((needthis < hold.length)){
          setTracking(needthis);
          console.log(hold.length + " in THIRD " + tracking + " " + needthis);
          setMoreOrLess(1);
        }
        else if(parseInt(tracking) === hold.length && hold.length !== 0){
          setTracking(tracking);
          console.log(hold.length + " in home fourth " + tracking);
          setMoreOrLess(1);
        }
        else{
          console.log("error")
          return
        }
      }
      else if(pageChangeChk === 2){
        console.log('inside see less')
        var needthis = (parseInt(tracking) - 5)
        if(tracking === hold.length){
          let loop = tracking;
          while(!(loop % 5 === 0)){
            loop--;
          }
          setTracking(loop);
        }
        else if(needthis > 5){
          console.log("less than, tracking > 5")
          setTracking(a => a - 5 );
          setMoreOrLess(2);
        } 
        else if(needthis <= 5){
          console.log("less than, tracking < 5 " + tracking)
          let test = 5
          setTracking(5);
          setMoreOrLess(2);
        }
        else{
          console.log("error")
          return
        }
      }
      else{
        console.log("ERROR: no more pages or less pages true")
      }
      return
    }

    const [MenuButton, setMenuButton] = useState(true);
    const toggleMenu = () => {
        setMenuButton(!MenuButton);
    };
    return(
      <div className='banner-container'>
        <img alt="" className="Top-Banner" src={Fly_Now}/>
          
        <div className='button-overlay'>
        {<button className="Top-Banner-2" onClick={toggleButton}/>}
            {!showButton &&  (
            <div className='button-group'>    
              <MyButton to="Contact Us" />  
              <MyButton to="signout" />
            </div>    
            )} 
          <UserBanner/>    
        </div>
      
          <div className='Second-Row-Ticket-Background'>
          
            {/* Integrating the SearchBar component */}
            <SearchBar onSearch={handleSearchResults} />
            {/* Display search results */}
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>{result.name}</li> 
              ))}
            </ul>
            
            {console.log("..... ")}
            {item !== undefined && tracking === 0 ? setTracking(5) : () => {console.log('nothing')}} {/*need to add check if hold.length > 5 and set tracking to that. I guess show more or show less wont appear either way but should be consistant*/}
            {item !== undefined ? obj.getTickets(hold,tracking, MoreOrLess) : () => {console.log('nothing')}}
            {item !== undefined && chkMore === true ? <a href='#' style={{flexDirection: 'column', marginRight: '10px'}} onClick={() => { a(obj, 1);}}>show more</a> : () => {console.log('nothing')}}
            {item !== undefined && chkLess === true ? <a href='#' style={{flexDirection: 'column'}} onClick={() => {a(obj, 2);}}>show less</a> : () => {console.log('nothing')}}
            {console.log (chkMore + "    tesssssssssssssssssssssssst    " + chkLess)}
          </div>
        
      </div>
    )


}



