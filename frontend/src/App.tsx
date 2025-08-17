import Navigation from "./components/common/Navigation";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import { useState } from "react";

function App() {
	const [tab, setTab] = useState<"shop" | "admin">("shop");

	return (
		<>
			<Navigation tab={tab} setTab={setTab} />
			<main>
				{tab === "shop" ? (
					<div className="max-w-6xl mx-auto px-4 py-8">
						<Shop />
					</div>
				) : (
					<Admin />
				)}
			</main>
		</>
	);
}

export default App;
