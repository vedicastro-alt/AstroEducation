import type { Metadata } from "next";
import { ReportFlow } from "@/components/ReportFlow";

export const metadata: Metadata = {
  title: "Get your child's reading — Little Stargazers",
  description:
    "Enter your child's birth details for a gentle, encouraging Vedic horoscope reading focused on how they learn best.",
};

export default function ReportPage() {
  return <ReportFlow />;
}
