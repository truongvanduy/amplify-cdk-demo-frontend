import { GraphQLResult, generateClient } from 'aws-amplify/api';
import './App.css';
import React, { useEffect, useState } from 'react';
import { listPosts } from './graphql/queries';
import { subscribeToLiveMessages } from './graphql/subscriptions';
import { broadcastLiveMessage } from './graphql/mutations';

const client = generateClient();

function App() {
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // fetches all posts
    async function fetchPosts() {
      const response: GraphQLResult = await client.graphql({
        query: listPosts,
      });

      setPosts(response?.data?.listPosts.items);
    }
    fetchPosts();

    // setup subscriptions for live chat messages
    const subscription = client
      .graphql({
        query: subscribeToLiveMessages,
      })
      .subscribe((next) => {
        // @ts-ignore
        setMessages((messages) => [
          ...messages,
          next.data.subscribeToLiveMessages,
        ]);
      });

    return () => subscription.unsubscribe();
  }, []);

  // sends the live chat message to users
  function handleMessageSend(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const inputElement = event.target as HTMLInputElement;
      client.graphql({
        query: broadcastLiveMessage,
        variables: { message: inputElement.value },
      });
    }
  }

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div>
        <h1>Articles</h1>
        {posts.map((post: { title: string; content: string }) => (
          <div
            style={{
              border: '1px solid black',
              padding: 10,
              borderRadius: 10,
            }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <div>
        <h1>Live chat</h1>
        <input
          type='text'
          placeholder='Hit enter to send message'
          onKeyDown={handleMessageSend}
        />
        <hr></hr>
        <ul>
          {messages.map((message) => (
            <li>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
