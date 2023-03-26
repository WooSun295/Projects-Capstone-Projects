import React, { useState, useEffect } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import addCommas from "../helpers/addCommas";
import getLogo from "../logos/getLogo";
import "./Job.css";
import JoblyAPI from "../API/JoblyAPI";
import OffPage from "../OffPage/OffPage";

const Job = () => {
   const { key } = useParams();
   const [error, setError] = useState(null);
   const [isLoading, setLoading] = useState(true);
   const [job, setJob] = useState();
   const [com, setCom] = useState();

   useEffect(() => {
      async function getData() {
         try {
            let job = await JoblyAPI.get("jobs", key);
            let com = await JoblyAPI.get("companies", job.job.company);
            setJob(job.job);
            setCom(com.company);
            setLoading(false);
         } catch (e) {
            setError(e.response);
         }
      }
      getData();
   }, []);

   if (error) {
      return <OffPage msg={`${error.status} ${error.statusText}`} />;
   }

   if (isLoading) {
      return <OffPage msg="Loading &hellip;" />;
   }

   let logo = null;
   let color = null;
   if ("logoUrl" in com) ({ logo, color } = getLogo(com.logoUrl));

   return (
      <section className="Job">
         <Card>
            <CardBody>
               <CardTitle className="Company-Heading">
                  {"logoUrl" in com &&
                     (logo ? (
                        <img src={logo} className="Company-Img"></img>
                     ) : (
                        <img
                           className="Company-Img"
                           src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                        />
                     ))}
                  <Link to={`/companies/${com.handle}`} className="Company-Title-Link">
                     <h1 className="Company-Title">{com.name}</h1>
                  </Link>
               </CardTitle>
            </CardBody>
            <CardBody className="Job-Heading">
               <CardTitle>
                  <h1 className="Job-Title">{job.title}</h1>
               </CardTitle>
               <CardText className="Job-Desc">
                  {job.salary ? `Salary: $${addCommas(job.salary)}` : "No Salary"}
                  <br />
                  {job.equity ? `Equity: ${Math.round(job.equity * 100)}%` : "No Equity"}
               </CardText>
            </CardBody>
            <button className="Job-Btn" style={{ backgroundColor: color }}>
               Apply
            </button>
         </Card>
      </section>
   );
};

export default Job;
