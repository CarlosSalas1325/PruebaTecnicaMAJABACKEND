import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import bcrypt from "bcryptjs";
import { Post } from "../posts/post.entity";
import { Comment } from "../comments/comment.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 80 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 140 })
  email!: string;

  @Column({ name: "password_hash", select: false })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20, default: "author" })
  role!: "admin" | "author";

  @OneToMany(() => Post, (post: Post) => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  comments!: Comment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }

  async comparePassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.passwordHash);
  }
}
