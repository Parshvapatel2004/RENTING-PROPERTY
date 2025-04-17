const connectDB = require("./DB/connectDB");
const express = require("express");
const cors = require("cors");
const { register_user } = require("./API/register_user");
const { register_owner } = require("./API/register_owner");
const { upload_property } = require("./API/upload_property");
const { send_feedback } = require("./API/send_feedback");
const { send_inquiry } = require("./API/send_inquiry");
const { send_request } = require("./API/send_request");
const { ContactUs } = require("./API/contactUs");
const { login } = require("./API/login");
const { FetchAllUser } = require("./API/FetchAllUser");
const { FetchAllOwner } = require("./API/FetchAllOwner");
const { FetchAllProperty } = require("./API/FetchAllProperty");
const { FetchAllRequest } = require("./API/FetchAllRequest");
const { FetchAllFeedback } = require("./API/FetchAllFeedback");
const { FetchAllInquiry } = require("./API/FetchAllInquiry");
const { send_complaint } = require("./API/send_complaint");
const { FetchAllComplaint } = require("./API/FetchAllComplaint");
const { FetchAllBooking } = require("./API/FetchAllBooking");
const { booking_with_payment } = require("./API/booking_with_payment");
const { FetchAllPayments } = require("./API/FetchAllPayments");
const { manage_bookings } = require("./API/manage_bookings");
const { view_payments } = require("./API/view_payment");
const { manage_property } = require("./API/manage_property");
const { UpdateProperty } = require("./API/UpdateProperty");
const Session = require("./API/session");
const Logout = require("./API/logout");
const session = require("express-session");
const {
  idUpload,
  profilePicUpload,
  propertyImgUpload,
} = require("./multer/multer");
const { UpdateProfile } = require("./API/UpdateProfile");
const { sendUserOTP } = require("./API/userSendOTP");
const { changeUserPassword } = require("./API/changeUserPassword");
const { verifyOTP } = require("./API/verifyOtp");
const { get_request } = require("./API/getPropertyRequest");
const { get_user_booking } = require("./API/getUserBookings");
const { cancel_booking_request } = require("./API/CancelBooking");
const { GenOrderId } = require("./API/genOrderId");
const { send_property_inquiry } = require("./API/send_property_inquiry");
const { view_payments_user } = require("./API/ViewUserPayments");
const { search_property } = require("./API/FindProperty");
const { edit_property } = require("./API/editProperty");
const { delete_property } = require("./API/deleteProperty");
const { get_property_inquiries } = require("./API/view_property_inquiries");
const { update_request_status } = require("./API/update_request");
const { adminlogin } = require("./API/adminLogin");
const { respond_complaint } = require("./API/response_complaint");
const { respond_feedback } = require("./API/respond_feedback");
const RespondToContact = require("./API/respond_contactus");
const { getDashboardCounts } = require("./API/getDashboardCounts");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { GoogleUserLogin } = require("./API/UserGoogleLogin");
const { DeleteUser } = require("./API/deleteUser");
const { deleteOwner } = require("./API/deleteOwner");
const { deleteProperty_admin } = require("./API/deleteProperty_admin");
const { AdminFetchAllProperty } = require("./API/admingetproperties");
const { UpdateAdminProfilePic } = require("./API/adminprofileupdate");

//connecting to database:
connectDB();

//middlewares:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/images/idProof", express.static("images/idProof"));
app.use("/images/profilePic", express.static("images/profilePic"));
app.use("/images/propertyImg", express.static("images/propertyImg"));

//routes:

app.post("/auth/google", GoogleUserLogin);
//common routes:
app.post("/login", login);
app.post("/contactUs", ContactUs);
app.post("/send_inquiry", send_inquiry);
app.post("/send_feedback", send_feedback);
app.post("/send_complaint", send_complaint);
app.post("/search_property", search_property);
app.post(
  "/update_profile",
  profilePicUpload.fields([{ name: "profilePic", maxCount: 1 }]),
  UpdateProfile
);
app.get("/session", Session);
app.get("/logout", Logout);
app.post("/sendOtp", sendUserOTP);
app.post("/verifyOtp", verifyOTP);
app.post("/changePassword", changeUserPassword);
app.post("/add_product_inquiry", send_property_inquiry);

//user routes:
app.post("/register_user", register_user);
app.post("/send_request", send_request);
app.post("/generateOrderId", GenOrderId);
app.post("/make_payment", booking_with_payment);
app.get("/get_user_booking", get_user_booking);
app.get("/view_payment_user", view_payments_user);
app.post("/cancel_booking", cancel_booking_request);

//owner routes:
app.post(
  "/register_owner",
  idUpload.fields([{ name: "l_Id", maxCount: 1 }]),
  register_owner
);
app.post(
  "/upload_property",
  propertyImgUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "propertyProof", maxCount: 1 },
    { name: "identityId", maxCount: 1 },
  ]),
  upload_property
);
app.post(
  "/edit_property",
  propertyImgUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "propertyProof", maxCount: 1 },
    { name: "identityId", maxCount: 1 },
  ]),
  edit_property
);
app.post("/delete_property", delete_property);
app.get("/manage_booking", manage_bookings);
app.get("/manage_property", manage_property);
app.get("/get_property_request", get_request);
app.get("/view_payment", view_payments);
app.post("/update_property", UpdateProperty);
app.post("/get_property_inquiries", get_property_inquiries);
app.post("/update_request", update_request_status);

//admin routes:
app.post("/admin_login", adminlogin);
app.get("/fetch_all_user", FetchAllUser);
app.get("/fetch_all_owner", FetchAllOwner);
app.get("/fetch_all_property", FetchAllProperty);
app.get("/admin_fetch_all_property", AdminFetchAllProperty);
app.get("/fetch_all_request", FetchAllRequest);
app.get("/fetch_all_booking", FetchAllBooking);
app.get("/fetch_all_payment", FetchAllPayments);
app.get("/fetch_all_feedback", FetchAllFeedback);
app.get("/fetch_all_complaint", FetchAllComplaint);
app.get("/fetch_all_inquiry", FetchAllInquiry);
app.post("/respond_complaint", respond_complaint);
app.post("/respond_feedback", respond_feedback);
app.post("/respond_contactus", RespondToContact);
app.get("/getDashboardCounts", getDashboardCounts);
app.delete("/delete_user/:id", DeleteUser);
app.delete("/delete_owner/:id", deleteOwner);
app.delete("/delete_property/:id", deleteProperty_admin);
app.post(
  "/updateProfileAdmin",
  profilePicUpload.fields([{ name: "profilePic", maxCount: 1 }]),
  UpdateAdminProfilePic
);

//port:
const PORT = process.env.PORT || 4000;
app.listen(PORT);
console.log(`Server is listing on port http:localhost:${PORT}`);
