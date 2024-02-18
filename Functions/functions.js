import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import emailjs from "@emailjs/browser";

export const handleSignup = async (
  studentID,
  username,
  email,
  password,
  form
) => {
  let status = {
    success: false,
    otp: null,
    notValid: false,
    notValidEmail: false,
    err: null,
  };
  try {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingId = docSnap.data().id;
      console.log(docSnap.data().email);
      if (existingId === studentID) {
        const send = await sendEmail(form);
        if (send.success) {
          await setDoc(doc(db, "users", email), {
            name: username,
            id: studentID,
            email: email,
            dateOfReg: new Date(),
          });
          status.otp = send.otp;
          status.success = true;
        } else {
          status.err = send.error;
        }
      } else {
        status.notValid = true;
      }
    } else {
      status.notValidEmail = true;
      console.log("No such document!");
    }
  } catch (e) {
    status.err = e.message;
    console.log(e.message);
  }
  return status;
};

export const handleLogin = async (form) => {
  console.log(form);
  const status = {
    success: false,
    otp: null,
    err: null,
  };
  try {
    const send = await sendEmail(form);
    if (send.success) {
      status.otp = send.otp;
      status.success = true;
    }
  } catch (error) {
    console.log(error);
    status.err = error.message;
  }
  return status;
};

export const Login = async (email, password) => {
  const status = {
    success: false,
    err: null,
  };
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    status.success = true;
  } catch (error) {
    status.err = error.message;
    console.log(error.message);
  }
  return status;
};

export const createUser = async (email, password) => {
  const status = {
    success: false,
    err: null,
  };
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const washingtonRef = doc(db, "users", email);
    await updateDoc(washingtonRef, {
      dateOfReg: new Date(),
    });
    status.success = true;
  } catch (error) {
    status.err = error;
    alert(error.message);
  }
  console.log("Student Enrolled succesfully !!");
  return status;
};

export const generateToken = async (email) => {
  let status = {
    success: false,
    token: null,
    time: null,
    err: null,
  };
  try {
    const studentData = await getData(email);
    const tokenNumber = Math.floor(100000 + Math.random() * 900000);
    console.log(tokenNumber);

    const docRef = doc(db, "tokens", tokenNumber.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      generateToken(email);
      console.log("Document already exists");
    } else {
      const date = new Date();
      const time = getTimeFromDate(date);
      await setDoc(docRef, {
        name: studentData.name,
        id: studentData.id,
        timestamp: time,
        isCollected: false,
      });
      status.success = true;
      status.token = tokenNumber;
      status.time = time
    }
  } catch (e) {
    console.log(e);
    status.err = e.message;
  }
  return status;
};

const generateOTP = () => {
  let randomNumber = "";
  for (let i = 0; i < 4; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
};

const sendEmail = async (form) => {
  let status = {
    success: false,
    otp: null,
    error: null,
  };
  const otp = generateOTP();
  form.otp.value = otp;

  await emailjs
    .sendForm("service_vwwafuc", "template_ujysduq", form, {
      publicKey: "OWoHGZ94EI8Pn8jAU",
    })
    .then(
      () => {
        console.log("SUCCESS!");
        console.log("Your OTP:", otp);
        status.success = true;
        status.otp = otp;
      },
      (error) => {
        console.log("FAILED...", error.text);
        status.error = error;
      }
    );
  return status;
};


const getData = async(email) =>{
  try{
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = {
        id: docSnap.data().id,
        name: docSnap.data().name
      }
      return data;
    } else {
      return null;
    }
  }catch(err){
    alert(err.message);
  }
}

export const getTimeFromDate = (date) => {

  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const period = hours < 12 ? "AM" : "PM";

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

// const TokenExistance = async () => {

//   let status = {
//     success: false,
//     error: null,
//   };

//   const docRef = doc(db, "tokens", "--");
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log("No such document!");
//   }
// };
