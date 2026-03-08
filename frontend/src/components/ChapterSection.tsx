"use client";

import React from "react";

interface ChapterSectionProps {
  id: string;
  chapterNum: string;
  title: string;
  description: string;
  children: React.ReactNode;
  bg2?: boolean;
  orange?: boolean;
}

export default function ChapterSection({
  id,
  chapterNum,
  title,
  description,
  children,
  bg2 = false,
  orange = false,
}: ChapterSectionProps) {
  return (
    <section 
      id={id} 
      style={{ 
        padding: "5rem 2rem", 
        background: bg2 ? "var(--bg-2)" : "transparent" 
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="chapter-label-wrap">
          <span className={`chapter-square ${orange ? "chapter-square-orange" : ""}`} />
          <span className={`chapter-num ${orange ? "chapter-num-orange" : ""}`}>
            {chapterNum}
          </span>
        </div>
        <h2 className="section-title">{title}</h2>
        <p className="section-body">{description}</p>
        {children}
      </div>
    </section>
  );
}
