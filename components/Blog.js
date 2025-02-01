"use client";

import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  blogcategory: existingBlogcategory,
  description: existingDescription,
  tags: existingTags,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [blogcategory, setBlogcategory] = useState(existingBlogcategory || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [tags, setTags] = useState(existingTags || []);
  const [status, setStatus] = useState(existingStatus || "");

  async function createProduct(ev) {
    ev.preventDefault();

    const data = { title, slug, description, blogcategory, tags, status };

    try {
      if (_id) {
        await axios.put("/api/blogapi", { ...data, _id });
      } else {
        await axios.post("/api/blogapi", data);
      }
      setRedirect(true);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  }

  if (redirect) {
    router.push("/");
    return null;
  }

  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;

    const newSlug = inputValue.replace(/\s+/g, "-").toLowerCase();

    setSlug(newSlug);
  };

  return (
    <form onSubmit={createProduct} className="addWebsiteform">
      <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          placeholder="Enter blog title"
          required
        />
      </div>

      <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          value={slug}
          onChange={handleSlugChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          type="text"
          placeholder="Enter slug URL"
          required
        />
      </div>

      <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
        <label htmlFor="category">Category</label>
        <select
          value={blogcategory}
          onChange={(e) =>
            setBlogcategory(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          name="category"
          id="category"
          multiple
        >
          <option value="html">Html</option>
          <option value="nextjs">Next.js</option>
          <option value="database">Database</option>
          <option value="vercel">Vercel</option>
        </select>
        <p className="existingcategory flex gap-1 mt-1 mb-1">
          Selected:{" "}
          {Array.isArray(blogcategory) &&
            blogcategory.map((category) => (
              <span key={category}>{category}</span>
            ))}
        </p>
      </div>

      <div className="description w-100 flex flex-col flex-left mb-2">
        <label htmlFor="description">Blog Content</label>
        <MarkdownEditor
          value={description}
          onChange={(ev) => setDescription(ev.text)}
          style={{ width: "100%", height: "400px" }}
          renderHTML={(text) => (
            <ReactMarkdown
              components={{
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return inline ? (
                    <code>{children}</code>
                  ) : match ? (
                    <div style={{ position: "relative" }}>
                      <pre
                        style={{
                          padding: "0",
                          borderRadius: "5px",
                          overflow: "auto",
                          whiteSpace: "pre-wrap",
                        }}
                        {...props}
                      >
                        <code>{children}</code>
                      </pre>
                      <button
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          zIndex: "1",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(children);
                        }}
                      >
                        Copy code
                      </button>
                    </div>
                  ) : (
                    <code {...props}>{children}</code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
          )}
        />
      </div>

      <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
        <label htmlFor="tags">Tags</label>
        <select
          value={tags}
          onChange={(e) =>
            setTags(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          name="tags"
          id="tags"
          multiple
        >
          <option value="html">Html</option>
          <option value="nextjs">Next.js</option>
          <option value="database">Database</option>
          <option value="vercel">Vercel</option>
        </select>
        <p className="existingtags flex gap-1 mt-1 mb-1">
          Selected:{" "}
          {Array.isArray(tags) &&
            tags.map((tag) => <span key={tag}>{tag}</span>)}
        </p>
      </div>

      <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
        <label htmlFor="status">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          name="status"
          id="status"
        >
          <option value="">No select</option>
          <option value="draft">Draft</option>
          <option value="publish">Publish</option>
        </select>
        <p className="existingtags flex gap-1 mt-1 mb-1">Selected: {status}</p>
      </div>

      <div className="w-100 mb-2">
        <button type="submit" className="w-100 addwebbtn flex-center">
          Save Blog
        </button>
      </div>
    </form>
  );
}
