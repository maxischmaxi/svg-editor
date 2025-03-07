import { Editor } from "@/components/editor";
import { cookies } from "next/headers";

export default async function Home() {
    const cookie = await cookies();
    const layout = cookie.get("react-resizable-panels:layout");

    let defaultLayout;
    if (layout) {
        defaultLayout = JSON.parse(layout.value);
    }

    return <Editor defaultLayout={defaultLayout} />;
}
