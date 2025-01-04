"use client";

import React from "react";

interface RelativeTimeProps {
  dateString: string | number; // Accept both string or number as date
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ dateString }) => {
  // Ensure that dateString is always a string before passing it to new Date
  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  };

  // Convert number timestamp to string if necessary
  const formattedDateString = typeof dateString === "number" ? dateString.toString() : dateString;

  return <span>{getRelativeTime(formattedDateString)}</span>;
};

export default RelativeTime;
