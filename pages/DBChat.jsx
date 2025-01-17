import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from 'react';
import remarkGfm from 'remark-gfm';
import ModelDropdown from "@/components/ModelDropdown";
import { Textarea } from "@nextui-org/input";
import { Alert, Button, Card, CardBody, CardHeader, Chip, Skeleton, Snippet } from "@nextui-org/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function DBChat() {
    const [prompt, setPrompt] = useState('');
    const [isPromptValid, setIsPromptValid] = useState(true);
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    const pagetitle = "DB Chat";
    const pagedesc = "This application leverages the power of AI to provide a natural language interface to your database. It begins by establishing a connection to your database, either locally or via a REST API. Then, it integrates with a chosen AI model using provided API keys. The core functionality is built into a web application, where the CopilotKit is configured and trained on your specific database schema and data. This training allows users to interact with their data using conversational language via an integrated chat interface. After thorough local testing, the application is deployed to a hosting platform, providing an accessible and user-friendly way to query and interact with your data through AI.";

    const BrandIcon = () => {
        return (
            <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
            />
        );
    }

    // const generateScript = async () => {
    //     setIsPromptValid(true);
    //     if (!prompt || prompt.length <= 0) { setIsPromptValid(false); return; }
    //     setLoading(true);
    //     const response = await fetch('/api/generate', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ prompt, model: selectedModel?.id }),
    //     });

    //     const data = await response.json();
    //     setScript(data.script);
    //     setLoading(false);
    // };

    return (
        <>
            <Head>
                <title>{pagetitle}</title>
                <meta name="description" content={pagedesc} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
                <main className={styles.main}>
                    <div className="flex items-center justify-center w-full">
                        <Alert description={pagedesc} title={pagetitle} color="secondary"  />
                    </div>
                    <div className="w-full grid gap-2">                        
                        Feature development in progress...
                    </div>
                </main>
            </div>
        </>
    );
}
