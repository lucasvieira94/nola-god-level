import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  format?: "currency" | "number" | "time";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  format = "number",
}) => {
  const formatValue = () => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      case "time":
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${minutes}min ${seconds}s`;
      default:
        return new Intl.NumberFormat("pt-BR").format(value);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-16 font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-24 font-bold mt-2 text-gray-900 dark:text-white">
            {formatValue()}
          </p>
          {subtitle && (
            <p className="text-16 text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center mt-4">
          <div
            title={
              trend >= 0
                ? `Crescimento de ${trend.toFixed(
                    1
                  )}% em relação ao período anterior`
                : `Queda de ${Math.abs(trend).toFixed(
                    1
                  )}% em relação ao período anterior`
            }
            className="inline-flex cursor-help mr-1"
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span
            className={clsx(
              "text-16 font-medium cursor-help",
              trend >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
            title={
              trend >= 0
                ? `Crescimento de ${trend.toFixed(
                    1
                  )}% em relação ao período anterior`
                : `Queda de ${Math.abs(trend).toFixed(
                    1
                  )}% em relação ao período anterior`
            }
          >
            {trend > 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
          <span className="text-16 text-gray-500 dark:text-gray-400 ml-2">
            vs período anterior
          </span>
        </div>
      )}
    </div>
  );
};
