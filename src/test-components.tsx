// Test file to verify imports work
import { BlogPage } from "./components/BlogPage";
import { FAQPage } from "./components/FAQPage";

console.log("BlogPage:", BlogPage);
console.log("FAQPage:", FAQPage);

export default function TestComponents() {
  return (
    <div>
      <h1>Testing Components</h1>
      <BlogPage />
      <FAQPage />
    </div>
  );
}
