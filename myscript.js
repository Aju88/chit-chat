var mainApp = {};
let userName = null,
  receiver = null,
  moved_contact = null;

(function () {
  var firebase = app_fireBase;
  var uid = null;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
      // User is signed in.
      console.log("logged in as " + user.displayName);
      userName = user.displayName;
      if (userName != null) {
        db.ref("Messages/" + userName).set({
          message: "logged in as " + userName,
        });
      }
      // console.log(userName);
      uid = user.uid;
    } else {
      uid = null;
      //redirect to login page
      window.location.replace("index.html");
    }
    getContacts();
  });
  //------------------logount funtion--------------------//
  function logOut() {
    firebase.auth().signOut();
  }
  mainApp.logOut = logOut;
})();

//---------------------set the receiver--------------------//
function selectUser(user) {
  receiver = user;
  var contact_list = document.getElementById("contact-list"); //in the contact list
  var selected_user = document.getElementById("selected-contact"); //in messaging list
  document.getElementById("'" + receiver + "'").style.display = "none"; //hiding the selected contact from contacts list

  //moving contact from contacts list to messaging list on reselecting
  var selected_again = document.getElementsByClassName("contact")[0];
  if (selected_again) {
    console.log(selected_again);
    selected_again.style.display = "none";
  }

  //moving previously messaged contact from messaging list to contact list
  var currnt_user = document.getElementsByClassName("current")[0];
  if (currnt_user) {
    currnt_user.style.display = "none";
    console.log(currnt_user.innerHTML);

    contact_list.innerHTML += ` <li class="contact" id="'${moved_contact}'">${currnt_user.innerHTML}</li> `;
  }

  //adding selected contact from contact list to messaging list
  selected_user.innerHTML = `<li id="'${receiver}'" class=
  "current"><button  onclick="selectUser('${receiver}')" >${receiver}</li>`;
  moved_contact = user; //to get the previously messaged contacts id
  document.getElementById("messages-received").innerHTML = ""; //to get the previously received msg

  getData(); //getting messages received from the selected contact
}

var db = firebase.database();

//--------------------send a message---------------------//

function saveMessage() {
  var message = document.getElementById("message-sent").value;
  db.ref("Messages/" + receiver + "/" + userName).update({
    sender: userName,
    message: message,
  });
  getSentData();

  return false;
}

//------------------get message received-------------------//

function getData() {
  console.log(userName);

  var user_ref = db.ref("Messages/" + userName + "/" + receiver);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    if (data) {
      var html = "";
      html += "<li>";
      html += data.message;
      html += "</li>";
      document.getElementById("messages-received").innerHTML += html;
    }
  });
}
var p = 0;
//---------------to get sent meessage ------------------------//
function getSentData() {
  console.log(p);
  var html;
  var user_ref = db.ref("Messages/" + receiver + "/" + userName);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    p++;
    html = "";
    html += `<li class="sent">`;
    html += data.message;
    html += "</li>";
    document.getElementById("messages-received").innerHTML += html;
  });
}

//--------------------getting the available contacts to send messsage-------------------//

function getContacts() {
  var user_ref = db.ref("Messages");
  user_ref.on("value", function (snapshot) {
    var users = Object.getOwnPropertyNames(snapshot.val());
    // console.log("users are: " + users);

    var contactHtml = "",
      userHtml = "";

    for (let i = 0; i < users.length; i++) {
      if (users[i] === userName) {
        userHtml += `<li id="logged-user">`;

        userHtml += users[i] + "(You)";
      } else {
        contactHtml += `<li id="'${users[i]}'"><button  onclick="selectUser('${users[i]}')">`;

        contactHtml += users[i];
      }
      contactHtml += "</button></li>";
      userHtml += "</li>";
    }
    document.getElementById("contact-list").innerHTML = contactHtml;
    document.getElementById("user-contact").innerHTML = userHtml;
  });
}
