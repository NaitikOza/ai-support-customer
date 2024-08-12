// pages/index.js
import Head from 'next/head';
import styles from '../styles/LandingPage.module.css'; // Import the CSS module

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>EchoBot Landing Page</title>
        <meta name="description" content="EchoBot, the next-gen chatbot." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.headline}>EchoBot, the next-gen chatbot.</h1>
    </div>
  );
}

