import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import Form from "../Form/Form";
import FormButton from "../FormButton/FormButton";
import Topics from "../Topics/Topics";
import styles from "./CreatePost.module.css";

export default function CreatePost() {
  const editorRef = useRef(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const editorContent = editorRef.current.getContent({ format: "text" }).trim();

    if (!editorContent) {
      alert("Content is required.");
      return;
    }

    formData.append("content", editorRef.current.getContent());

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
        method: "post",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors: badRequestErrors } = await res.json();

          setErrors(badRequestErrors);
          window.scrollTo({
            top: 0,
          });
          return;
        }

        throw new Error("Failed to create post please try again later");
      }

      const { msg } = await res.json();

      toast.success(msg);
      navigate("/");
    } catch {
      toast.error("Failed to create post please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <h1>Create a new post</h1>
      <Form onSubmit={handleSubmit}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            Title
            <input type="text" name="title" placeholder="Post title" required />
          </label>
          <div className={styles.editor}>
            <p>Content</p>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              init={{
                content_style: "body { font-family: 'roboto', Arial, sans-serif; }",
                menubar: "file edit insert format",
              }}
            />
          </div>
          <label>
            Cover image (optional)
            <input type="file" name="postImage" accept="image/*" />
          </label>
          <Topics className={styles.topics} />
          <div className={styles.publish}>
            <label>
              Publish
              <input type="checkbox" name="published" defaultChecked />
            </label>
          </div>
          <FormButton disabled={loading}>Create post</FormButton>
        </div>
      </Form>
    </main>
  );
}
