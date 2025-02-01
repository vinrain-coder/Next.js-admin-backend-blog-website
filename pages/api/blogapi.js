import dbConnect from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

export default async function handle(req, res) {
  await dbConnect();

  const { method } = req;

  if (method === "POST") {
    const { title, slug, description, blogcategory, tags, status } = req.body;

    const blogDoc = await Blog.create({
      title,
      slug,
      description,
      blogcategory,
      tags,
      status,
    });

    res.json(blogDoc);
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Blog.findById(req.query.id));
    } else {
      res.json((await Blog.find()).reverse());
    }
  }

  if (method === "PUT") {
    const { _id, title, slug, description, blogcategory, tags, status } =
      req.body;
    await Blog.updateOne(
      { _id },
      {
        title,
        slug,
        description,
        blogcategory,
        tags,
        status,
      }
    );

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Blog.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
