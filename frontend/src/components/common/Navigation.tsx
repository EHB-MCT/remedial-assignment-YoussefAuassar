import { Beer, Settings } from "lucide-react";

type NavigationProps = {
	tab: "shop" | "admin";
	setTab: (t: "shop" | "admin") => void;
};

export default function Navigation({ tab, setTab }: NavigationProps) {
	return (
		<header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
			<div className="max-w-6xl mx-auto px-1 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3 font-semibold text-slate-900 text-xl">
					<Beer className="w-7 h-7" /> Festival Drink Simulator
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setTab("shop")}
						className={`px-4 py-2 rounded-xl text-base ${
							tab === "shop"
								? "bg-slate-900 text-white"
								: "bg-slate-200 hover:bg-slate-300"
						}`}
					>
						Shop
					</button>
					<button
						onClick={() => setTab("admin")}
						className={`px-4 py-2 rounded-xl text-base ${
							tab === "admin"
								? "bg-slate-900 text-white"
								: "bg-slate-200 hover:bg-slate-300"
						} flex items-center gap-2`}
					>
						<Settings className="w-5 h-5" /> Admin
					</button>
				</div>
			</div>
		</header>
	);
}
