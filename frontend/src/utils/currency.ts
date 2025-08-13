export const niceCurrency = (n: number): string => {
	return new Intl.NumberFormat("nl-BE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2
	}).format(n);
};
