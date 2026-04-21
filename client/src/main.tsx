import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function initAnalytics() {
	const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
	const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

	if (!endpoint || !websiteId) return;

	const normalizedEndpoint = endpoint.endsWith("/")
		? endpoint.slice(0, -1)
		: endpoint;

	const script = document.createElement("script");
	script.defer = true;
	script.src = `${normalizedEndpoint}/umami`;
	script.setAttribute("data-website-id", websiteId);
	document.head.appendChild(script);
}

initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
