import { useState, Fragment } from "react";

export default function Topics({ className, initialTopics = [] }) {
  const [topicValue, setTopicValue] = useState("");
  const [topics, setTopics] = useState(initialTopics);

  return (
    <div className={className}>
      <div>
        <label>
          Topics
          <input
            type="text"
            placeholder="Topic name"
            value={topicValue}
            onChange={(e) => setTopicValue(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (!topicValue.trim()) {
              alert("Topic can not be empty.");
              return;
            }
            const newTopics = [...topics, { name: topicValue.trim() }];
            setTopics(newTopics);
            setTopicValue("");
          }}
        >
          Create
        </button>
      </div>

      <div style={{ display: topics.length === 0 ? "none" : "flex" }}>
        {topics.map((topic, index) => {
          return (
            <Fragment key={index}>
              <label>
                {topic.name}
                <input type="checkbox" name="topics" value={topic.name} defaultChecked />
              </label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
