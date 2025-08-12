import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  round: process.env.ROUND,
  jwt: {
    jwt_access_scret: process.env.JWT_ACCESS_SCRET,
    jwt_refresh_scret: process.env.JWT_REFRESH_SCRET,
    jwt_access_expire: process.env.JWT_ACCESS_EXPIRE,
    jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE,
  },
  cloudinary: {
    cloudinary_cloude_name: process.env.CLOUDINARY_CLOUDE_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  ssl: {
    store_id: process.env.STORE_ID,
    store_password: process.env.STORE_PASSWORD,
    is_live:process.env.IS_LIVE
  },
  base_url: process.env.BASE_URL,
  client_url: process.env.CLIENT_URL,
};
