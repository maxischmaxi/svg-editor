"use client";

import { useEditorTheme } from "@/hooks/useEditorTheme";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { ChangeEvent, useRef, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Link from "next/link";

type Props = {
    defaultLayout?: number[];
};
const defaultCode = `<!-- sample rectangle -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" x="50" y="50" fill="red" />
</svg>`;

function getDefaultCode(): string {
    if (typeof window === "undefined") return defaultCode;
    const local = window.localStorage.getItem("svg");
    if (local) return local;
    return defaultCode;
}

export function Editor({ defaultLayout = [50, 50] }: Props) {
    const theme = useEditorTheme();
    const [code, setCode] = useState(getDefaultCode());
    const inputRef = useRef<HTMLInputElement>(null);

    function handleUpload() {
        inputRef.current?.click();
    }

    function handleDownload() {
        const blob = new Blob([code], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.svg";
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast("Downloaded SVG", { icon: <Check /> });
    }

    function onUploadChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    setCode(result);
                }
            };
            reader.readAsText(file);

            event.target.value = "";
            toast("Uploaded SVG", { icon: <Check /> });
        }
    }

    function handleSave() {
        localStorage.setItem("svg", code);
        toast("Saved SVG", { icon: <Check /> });
    }

    function onLayout(sizes: number[]) {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    }

    return (
        <>
            <header className="flex flex-row flex-nowrap justify-between p-4 border-b">
                <div className="flex flex-row flex-nowrap gap-4">
                    <input
                        type="file"
                        accept=".svg"
                        className="hidden"
                        ref={inputRef}
                        multiple={false}
                        aria-hidden="true"
                        aria-describedby="upload-svg"
                        onChange={onUploadChange}
                    />
                    <Button
                        type="button"
                        id="upload-svg"
                        variant="outline"
                        onClick={handleUpload}
                    >
                        Upload SVG
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDownload}
                    >
                        Download SVG
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSave}
                    >
                        Save SVG
                    </Button>
                </div>
                <div className="flex flex-row flex-nowrap gap-4">
                    <Link
                        className={buttonVariants({ variant: "outline" })}
                        href="https://github.com/maxischmaxi/svg-editor"
                        target="_blank"
                        title="View on GitHub"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                    </Link>
                    <ModeToggle />
                </div>
            </header>
            <main className="h-full w-full flex flex-row flex-nowrap">
                <PanelGroup direction="horizontal" onLayout={onLayout}>
                    <Panel defaultSize={defaultLayout[0]}>
                        <MonacoEditor
                            theme={theme}
                            value={code}
                            onChange={(value) => {
                                if (value) setCode(value);
                                else setCode("");
                            }}
                            language="xml"
                            options={{
                                theme: theme,
                                language: "xml",
                                minimap: { enabled: false },
                            }}
                        />
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-secondary" />
                    <Panel
                        defaultSize={defaultLayout[1]}
                        className="p-8 flex justify-center items-center"
                    >
                        <div
                            id="output"
                            className="aspect-square flex justify-center items-center"
                            dangerouslySetInnerHTML={{ __html: code }}
                        />
                    </Panel>
                </PanelGroup>
            </main>
        </>
    );
}
