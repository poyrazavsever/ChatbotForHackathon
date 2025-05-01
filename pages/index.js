import Head from "next/head";
import ChatInterface from "../components/ChatInterface";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gemini Chatbot</title>
      </Head>
      <main>
        <h1 className="text-2xl text-center mt-4">Gemini Chatbot</h1>
        <ChatInterface />
      </main>
    </>
  );
}
