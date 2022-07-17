import React, { useEffect, useState } from "react";
import Activity from "../components/Activity";
import "../pages_style/ActivityPage.css";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => { getActivites(); }, [])


  let getActivites = async () => {
    let activitiesTemp = [];
    let hourFlag = true;
    let dayFlag = true;
    let earlierFlag = true;
    let res = await fetch(`http://127.0.0.1:8000/api/get_activites/${localStorage.getItem('my_id')}`);
    let data = await res.json();
    for (let index in data) {
      if (time_delta(data[index].date_added).includes('min')) {
        if(hourFlag === true){
          activitiesTemp.push(<h3 key={index}>This hour</h3>);
          hourFlag = false;
        }
      }
      else if (time_delta(data[index].date_added).includes('hour')) {
        if(dayFlag === true){
          activitiesTemp.push(<h3 key={index}>This day</h3>);
          dayFlag = false;
        }
      }
      else if (time_delta(data[index].date_added).includes('day')) {
        if(earlierFlag === true){
          activitiesTemp.push(<h3 key={index}>Earlier</h3>);
          earlierFlag = false
        }
      }
      activitiesTemp.push(<Activity key={index + 1} influncer_id={data[index].influncer} profile_image={data[index].profile_image} username={data[index].username} action={data[index].action} />);
    }
    setActivities(activitiesTemp)
  }

  const time_delta = (string_date) => {
    let date = new Date(string_date)
    let now = new Date();
    let delta = (now - date) / 1000;
    let ago = " secs ago";
    if (delta > 60) {
      delta /= 60;
      ago = " mins ago";
      if (delta > 60) {
        delta /= 60;
        ago = " hours ago";
        if (delta > 24) {
          delta /= 24;
          ago = " days ago";
        }
      }
    }
    delta = Math.round(delta, 2)
    return delta + ago;
  }
  return (
    <div className="activity_page">
      <div className="activty_page_header">
        <h1 className="activty_page_header_title">Activity</h1>
      </div>
      <div className="activty_page_body">
        {activities}
      </div>
    </div>
  );
};

export default ActivityPage;
