// STEP 1 (document): Custom _document — sets dark class on <html> to prevent flash of light
// WHY: Adding class="dark" here (and the bg-gray-950 in globals.css) means there is
//      no white flash during hydration even before React loads.

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // WHY: lang="en" is required for accessibility and SEO; class="dark" forces dark mode
    <Html lang="en" className="dark">
      <Head />
      <body className="antialiased bg-gray-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
