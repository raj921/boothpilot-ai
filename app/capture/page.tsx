import { Shell, TopNav } from "@/components/ui";
import { CaptureClient } from "./capture-client";

export default function CapturePage() {
  return (
    <Shell>
      <TopNav />
      <CaptureClient />
    </Shell>
  );
}
