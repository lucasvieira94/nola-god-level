import React from "react";
import { Insight } from "@/api/client";

interface InsightsCardProps {
  insights: Insight[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
        <p>Nenhum insight disponível para o período selecionado.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-primary-600 bg-primary-50 dark:bg-primary-900/20";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "border-l-gray-400 bg-gray-50 dark:bg-gray-800/50";
      default:
        return "border-l-gray-300 bg-white dark:bg-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`card p-4 border-l-4 ${getPriorityColor(
            insight.priority
          )}`}
          role="article"
          aria-label={`Insight: ${insight.title}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label={insight.type}>
              {insight.icon}
            </span>
            <div className="flex-1">
              <h4 className="text-16 font-semibold text-gray-900 dark:text-white mb-1">
                {insight.title}
              </h4>
              <p className="text-14 text-gray-700 dark:text-gray-300">
                {insight.description}
              </p>
              {insight.priority === "high" && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  Alta Prioridade
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
