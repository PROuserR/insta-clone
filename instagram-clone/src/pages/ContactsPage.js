import React, { useEffect, useState, useContext } from "react";
import ChatContact from "../components/ChatContact";
import "../pages_style/ContactsPage.css";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);

  let getContacts = async () => {
    let res_1 = await fetch(`http://prouserr.pythonanywhere.com/api/get_profile/${localStorage.getItem('my_id')}`);
    let data_1 = await res_1.json();
    let contactsTemp = [];
    for (let index = 0; index < data_1.following.length; index++) {
      let res_2 = await fetch(`http://prouserr.pythonanywhere.com/api/get_profile/${data_1.following[index]}`);
      let data_2 = await res_2.json();
      contactsTemp.push(data_2)
    }
    setContacts(contactsTemp)
  }

  useEffect(() => {
    getContacts();
  }, [])

  return (
    <div className="chatting_page">
      <div className="chat_contacts_box">
        <div className="page_title">Messages</div>
          {contacts.map((contact, index) => (
            <ChatContact image={contact.image} username={contact.username} sender_id={contact.id} last_seen={contact.last_login} key={index} />
          ))}
      </div>
    </div>
  );
};

export default ContactsPage;
