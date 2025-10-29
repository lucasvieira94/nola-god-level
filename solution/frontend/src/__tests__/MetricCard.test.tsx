import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "../components/MetricCard";
import { DollarSign } from "lucide-react";

describe("MetricCard", () => {
  it("should render title and value", () => {
    render(
      <MetricCard title="Total Revenue" value={15000} icon={<DollarSign />} />
    );

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("15,000")).toBeInTheDocument();
  });

  it("should format value as currency", () => {
    render(
      <MetricCard
        title="Total Revenue"
        value={15000.5}
        format="currency"
        icon={<DollarSign />}
      />
    );

    expect(screen.getByText(/15,000\.50/)).toBeInTheDocument();
  });

  it("should display positive trend", () => {
    render(
      <MetricCard
        title="Total Orders"
        value={150}
        trend={15.5}
        icon={<DollarSign />}
      />
    );

    expect(screen.getByText(/15\.5%/)).toBeInTheDocument();
    expect(screen.getByText(/vs\. last period/)).toBeInTheDocument();
  });

  it("should display negative trend", () => {
    render(
      <MetricCard
        title="Total Orders"
        value={150}
        trend={-8.2}
        icon={<DollarSign />}
      />
    );

    expect(screen.getByText(/-8\.2%/)).toBeInTheDocument();
  });

  it("should render custom icon", () => {
    const { container } = render(
      <MetricCard
        title="Test Metric"
        value={100}
        icon={<DollarSign className="test-icon" />}
      />
    );

    expect(container.querySelector(".test-icon")).toBeInTheDocument();
  });

  it("should display subtitle if provided", () => {
    render(
      <MetricCard
        title="Total Revenue"
        value={15000}
        subtitle="Last 30 days"
        icon={<DollarSign />}
      />
    );

    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });
});
