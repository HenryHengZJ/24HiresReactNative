import * as firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRbuA5GsyX5HQpe_t2N6qtsuY8Lloldr8",
  authDomain: "jobseed-2cb76.firebaseapp.com",
  databaseURL: "https://jobseed-2cb76.firebaseio.com",
  storageBucket: "jobseed-2cb76.appspot.com",
  messagingSenderId: "848133085531",
  projectId: "jobseed-2cb76"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


export default firebaseApp;