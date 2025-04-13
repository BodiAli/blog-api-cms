import { useState, Fragment } from "react";

export default function Topics() {
  const [topicValue, setTopicValue] = useState("");
  const [topics, setTopics] = useState([]);

  return (
    <>
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          console.log(formData.getAll("topics"));
        }}
      >
        <label htmlFor="createTopic">Topics</label>
        <input
          type="text"
          value={topicValue}
          onChange={(e) => setTopicValue(e.target.value)}
          name="createTopic"
        />
        <button
          type="button"
          onClick={() => {
            const newTopics = [...topics, topicValue];
            setTopics(newTopics);
            setTopicValue("");
          }}
        >
          Create
        </button>
        {topics.map((topic, index) => {
          return (
            <Fragment key={index}>
              <label>
                {topic}
                <input type="checkbox" name="topics" value={topic} />
              </label>
            </Fragment>
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
