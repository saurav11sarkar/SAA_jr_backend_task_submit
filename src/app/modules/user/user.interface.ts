export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee" | "jobSeeker";
  company?: string;
  profilePicture?: string;
}
