import Express from "express";
import * as cors from "cors";
import LoginRoute from "./routes/login";
import SignupRoute from "./routes/signup";
import AuthenticateRoute from "./routes/authenticate";
import CreateListRoute from "./routes/createList";
import GetListRouter from "./routes/getList";
import GetAllListsRoute from "./routes/getAllLists";
import AddItemToListRoute from "./routes/addItemToList";
import RemoveItemFromListRoute from "./routes/removeItemFromList";
import InviteUserToListRoute from "./routes/inviteUserToList";
import LogoutRoute from "./routes/logout";
import HealthRoute from "./routes/health";
import GetAllInvitesRoute from "./routes/getAllInvites";
import SettingsRoute from "./routes/settings";
import AcceptInviteRoute from "./routes/acceptInvite";
import GetAllInvitesFromListRoute from "./routes/getAllInvitesFromList";
import DeleteInviteFromListRoute from "./routes/deleteInviteFromList";
import DeclineInviteRoute from "./routes/declineInvite";

const app = Express();
const WEB_URL = process.env.WEB_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;
app.use(
  cors.default({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: NODE_ENV === "DEV" ? "http://localhost:3000" : WEB_URL,
    methods: ["GET", "POST"],
  })
);
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.use(LoginRoute);
app.use(SignupRoute);
app.use(AuthenticateRoute);
app.use(CreateListRoute);
app.use(GetListRouter);
app.use(GetAllListsRoute);
app.use(AddItemToListRoute);
app.use(RemoveItemFromListRoute);
app.use(InviteUserToListRoute);
app.use(LogoutRoute);
app.use(HealthRoute);
app.use(GetAllInvitesRoute);
app.use(SettingsRoute);
app.use(AcceptInviteRoute);
app.use(GetAllInvitesFromListRoute);
app.use(DeleteInviteFromListRoute);
app.use(DeclineInviteRoute);

app.listen(3003, () => {
  console.log("Server started on port 3003");
  if (process.env.NODE_ENV === "DEV") {
    console.warn("====================== WARNING ======================");
    console.warn("Running in DEV mode, instance is not secure.");
    console.warn("====================== WARNING ======================");
  }
});
