import { useState } from "react";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
	const [tab, setTab] = useState<"shop" | "admin">("shop");
	const [simulate, setSimulate] = useState(false);

	return (
		<>
			<Navigation
				tab={tab}
				setTab={setTab}
				simulate={simulate}
				setSimulate={setSimulate}
			/>
			<main className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-slate-900 mb-6">
					{tab === "shop" ? "Shop" : "Admin"} Dashboard
				</h1>
				<p className="text-slate-600">
					{tab === "shop"
						? "Welcome to the Festival Drink Shop!"
						: "Admin panel for managing the festival drink system."}
				</p>
			</main>
		</>
	);
}

export default App;
