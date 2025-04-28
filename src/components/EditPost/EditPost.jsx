import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import Form from "../Form/Form";
import FormButton from "../FormButton/FormButton";
import Topics from "../Topics/Topics";
import Loader from "../Loader/Loader";
import styles from "./EditPost.module.css";

export default function EditPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);
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
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`, {
        method: "PUT",
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

        throw new Error("Failed to update post please try again later");
      }

      const { msg } = await res.json();

      toast.success(msg);
      navigate(-1, { viewTransition: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    async function fetchUserPost() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`);

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = await res.json();
            throw new Error(error);
          }
          throw new Error("Failed to fetch post");
        }

        const post = await res.json();

        setPost(post);
      } catch (error) {
        toast.error(error.message);
        navigate("/", { viewTransition: true });
      } finally {
        setLoading(false);
      }
    }

    fetchUserPost();
  }, [postId, navigate]);

  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      <h1>Edit post</h1>
      <Form onSubmit={handleSubmit}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            Title
            <input
              type="text"
              name="title"
              placeholder="Post title"
              maxLength={255}
              defaultValue={post?.title}
              required
            />
          </label>
          <div className={styles.editor}>
            <p>Content</p>
            <Editor
              initialValue={post?.content}
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
          <Topics initialTopics={post?.Topics} className={styles.topics} />
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => {
                navigate(-1, { viewTransition: true });
              }}
            >
              Cancel
            </button>
            <FormButton disabled={loading}>Confirm</FormButton>
          </div>
        </div>
      </Form>
    </main>
  );
}
