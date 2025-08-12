import express from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { employeeRouter } from "../modules/employee/employee.routes";
import { jobSeekerRouter } from "../modules/jobSeeker/jobSeeker.routes";
const router = express.Router();

const hiremeRouter = [
  { path: "/auth", name: authRouter },
  { path: "/user", name: userRouter },
  { path: "/admin", name: adminRouter },
  { path: "/employee", name: employeeRouter },
  { path: "/job-seeker", name: jobSeekerRouter },
];

hiremeRouter.forEach((route) => {
  router.use(route.path, route.name);
});

export default router;
