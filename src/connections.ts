import pgpClass from "pg-promise";

import { config } from "dotenv";
config();

const pgp = pgpClass();

const INT8 = 20;
pgp.pg.types.setTypeParser(INT8, parseInt);

export const db = pgp({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: "postgres",
});
