import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../users/user.entity";
import { Category } from "../categories/category.entity";
import { Comment } from "../comments/comment.entity";

@Entity("posts")
@Index(["createdAt"])
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ length: 150 })
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "varchar", length: 20, default: "draft" })
  status!: "draft" | "published";

  @ManyToOne(() => User, (user: User) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable({
    name: "posts_categories",
    joinColumn: { name: "post_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" }
  })
  categories!: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments!: Comment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
