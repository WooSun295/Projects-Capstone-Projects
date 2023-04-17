import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PokeWikiAPI from "../../../helpers/backend";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import Offpage from "../../Offpage/Offpage";

import "./UserDetails.css";

const UserDetails = ({ userToken, signout }) => {
   const { username } = useParams();
   const [userInfo, setUserInfo] = useState();
   const [isLoading, setIsLoading] = useState(true);

   let token;
   if (userToken) {
      token = userToken._token ? userToken._token : JSON.parse(userToken)._token;
   }

   useEffect(() => {
      setIsLoading(true);
      const getData = async () => {
         let data = await PokeWikiAPI.userGet(token);
         setUserInfo(data.user);
         setIsLoading(false);
      };
      getData();
   }, [username, token]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="UserPage">
         <Card>
            <CardBody className="UP-Header">
               <CardTitle>
                  <img src={userInfo.pfpUrl} alt="pfp" className="UP-pfpimg" />
                  <div className="UP-Header-Texts">
                     <h3 className="UP-Title">
                        {userInfo.firstName} {userInfo.lastName}
                     </h3>

                     <small className="UP-Username">@{userInfo.username}</small>
                     <p className="UP-Email">{userInfo.email}</p>
                     <Link to={`/user/${userInfo.username}/update`}>
                        <button className="UP-Btn Update">Update</button>
                     </Link>
                     <Link to="/">
                        <button className="UP-Btn Signout" onClick={signout}>
                           Sign Out
                        </button>
                     </Link>
                  </div>
               </CardTitle>
            </CardBody>
            <CardBody className="UP-Fav">
               <ListGroup>
                  {userInfo.favs.map((fav) => (
                     <ListGroupItem key={fav.id} className="favs">
                        <Link to={`/pokemon/${fav.id}`}>
                           {fav.imgUrl ? (
                              <>
                                 <img
                                    src={fav.imgUrl}
                                    alt={fav.name}
                                    className="favs-img"
                                 />
                                 <p className="favs-p">{fav.name}</p>
                              </>
                           ) : (
                              <p className="no-img favs-p">{fav.name}</p>
                           )}
                        </Link>
                     </ListGroupItem>
                  ))}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default UserDetails;
