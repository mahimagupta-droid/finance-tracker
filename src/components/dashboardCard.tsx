type DashboardCardProps = {
    title: string;
    amount: number;
    type: "income" | "expense" | "balance";
};

export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export default function DashboardCard({ title, amount, type }: DashboardCardProps) {
    const getStyles = () => {
        switch (type) {
            case "income":
                return "bg-green-500/10 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
            case "expense":
                return "bg-red-500/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
            case "balance":
                return "bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 dark:text-gray-300";
        }
    };
    return (
        <div className={`rounded-2xl border p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 ${getStyles()}`}>
            <h2 className="text-sm opacity-70 mb-2">{title}</h2>
            <p className="text-3xl font-bold tracking-wide">
                {formatter.format(amount)}
            </p>
        </div>
    );
}