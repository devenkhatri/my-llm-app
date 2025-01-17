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

export default function MultiLLMChat() {
    const [prompt, setPrompt] = useState('');
    const [isPromptValid, setIsPromptValid] = useState(true);
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    const pagetitle = "Multi LLM Chat";
    const pagedesc = "Tired of switching between different AI chatbots? Unlock the power of multiple free AI models. This app lets you chat with multiple free LLMs all in one place. Discover the unique strengths of each model and get the best responses.";

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

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        console.log("Selected Model:", model);
    };

    const generateScript = async () => {
        setIsPromptValid(true);
        if (!prompt || prompt.length <= 0) { setIsPromptValid(false); return; }
        setLoading(true);
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, model: selectedModel?.id }),
        });

        const data = await response.json();
        setScript(data.script);
        setLoading(false);
    };

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
                        <Alert description={pagedesc} title={pagetitle} color="primary"  />
                    </div>
                    <div className="w-full grid gap-2">
                        <Card>
                            <CardBody>
                                <ModelDropdown onModelSelect={handleModelSelect} />
                                {selectedModel && (
                                    <Card>
                                        <CardHeader><Chip color="primary" variant="dot">Selected Model</Chip></CardHeader>
                                        <CardBody>
                                            <Snippet symbol={""} className="snippet-wrap">
                                                <p>
                                                    <strong>Name:</strong> {selectedModel.id}
                                                </p>
                                                <p>
                                                    <strong>Description:</strong> {selectedModel.description}
                                                </p>
                                                <p>
                                                    <strong>Modality:</strong> {selectedModel.architecture.modality}
                                                </p>
                                            </Snippet>
                                        </CardBody>
                                    </Card>
                                )}
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <Textarea
                                    isRequired
                                    isInvalid={!isPromptValid}
                                    color="primary"
                                    errorMessage="The prompt cannot be empty"
                                    className="w-full"
                                    minRows={5}
                                    label="Input Prompt"
                                    labelPlacement="inside"
                                    placeholder="Enter your prompt here..."
                                    value={prompt}
                                    onValueChange={(e) => setPrompt(e)}
                                    variant={'bordered'}
                                    isClearable
                                    onClear={() => console.log("textarea cleared")}
                                />
                            </CardBody>
                        </Card>
                        <div>
                            <Button
                                isLoading={loading}
                                variant="solid"
                                color="primary"
                                startContent={<BrandIcon />}
                                radius="full"
                                onPress={generateScript}
                            >
                                Hit LLM
                            </Button>
                        </div>
                        <Card>
                            <CardBody>
                                <div className="text-primary text-lg">Generated Output:</div>
                                {loading &&
                                    <div className="w-full flex flex-col gap-2">
                                        <Skeleton className="h-3 w-2/5 rounded-lg" />
                                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    </div>}
                                {/* <CopyToClipboardButton
                  text={String(script) }
                  onSuccess={() => {console.log('success!'); }}
                  onError={() => console.log('error!')}
                >
                  <Button>Copy To Clipboard !</Button>
                </CopyToClipboardButton> */}
                                {/* <Textarea value={script}/> */}
                                <Markdown className={"markdown prose"} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                                    {script}
                                </Markdown>

                            </CardBody>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
