import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { User } from "../modules/users/user.entity";
import { Category } from "../modules/categories/category.entity";
import { Post } from "../modules/posts/post.entity";

const runSeed = async (): Promise<void> => {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const postRepo = AppDataSource.getRepository(Post);

  const existingAdmin = await userRepo.findOne({ where: { email: "admin@blog.local" } });

  let admin = existingAdmin;
  if (!admin) {
    admin = userRepo.create({
      name: "Admin",
      email: "admin@blog.local",
      passwordHash: "Admin123!",
      role: "admin"
    });
    await userRepo.save(admin);
  }

  const categoryNames = ["Tecnologia", "Backend", "Frontend"];
  const categories: Category[] = [];

  for (const name of categoryNames) {
    let category = await categoryRepo.findOne({ where: { name } });
    if (!category) {
      category = categoryRepo.create({ name, description: `Categoria ${name}` });
      await categoryRepo.save(category);
    }
    categories.push(category);
  }

  const existingPost = await postRepo.findOne({ where: { title: "Bienvenido al Blog" } });
  if (!existingPost && admin) {
    const post = postRepo.create({
      title: "Bienvenido al Blog",
      content: "Este es un post inicial para validar el flujo de la plataforma.",
      status: "published",
      author: admin,
      categories: [categories[0], categories[1]]
    });
    await postRepo.save(post);
  }

  // eslint-disable-next-line no-console
  console.log("Seed finalizado");
  await AppDataSource.destroy();
};

runSeed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
