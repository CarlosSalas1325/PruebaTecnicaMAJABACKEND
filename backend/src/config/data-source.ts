import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../modules/users/user.entity";
import { Post } from "../modules/posts/post.entity";
import { Category } from "../modules/categories/category.entity";
import { Comment } from "../modules/comments/comment.entity";

const useUrl = Boolean(env.databaseUrl);

const isVercel = process.env.VERCEL === "1";

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(useUrl
    ? { url: env.databaseUrl, ssl: { rejectUnauthorized: false } }
    : { host: env.db.host, port: env.db.port, username: env.db.user, password: env.db.password, database: env.db.name }),
  entities: [User, Post, Category, Comment],
  migrations: isVercel ? [] : [path.join(__dirname, "..", "migrations", "*.{ts,js}")],
  synchronize: false,
  logging: false
});
