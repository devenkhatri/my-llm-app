import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [timelapse, setTimelapse] = useState(0);

  const generateScript = async () => {
    // if(!prompt) alert("Prompt is empty");
    setTimelapse(Date.now())
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setScript(data.script);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>LLM AI Generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <h1 style={{ marginBottom: '0.5rem' }}>LLM AI Script Generator</h1>
          <ol>
            <li>
              Get started by entering the <code>prompt</code>.
            </li>
            <li>See your generated response in <code>output box</code>.</li>
          </ol>

          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Input your Prompt here:</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={5}
              style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
            />
            <div className={styles.ctas}>
              <a onClick={generateScript} className={styles.primary} style={{ padding: '0.5rem 1rem' }}>
                {loading ?
                  <Image
                    className={styles.logo}
                    src="/loading.gif"
                    alt="Please wait..."
                    width={20}
                    height={20}
                  /> :
                  <Image
                    className={styles.logo}
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                }
                Hit LLM
              </a>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Generated Output:</h2>
              <textarea
                value={script}
                readOnly
                rows={5}
                style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
