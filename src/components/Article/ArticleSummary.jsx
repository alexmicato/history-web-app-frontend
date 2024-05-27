import React from "react";
import "./ArticleSummary.css";

function ArticleSummary({ chapters }) {
    return (
        <div className="article-summary">
            <h4>Summary</h4>
            <ul>
                {chapters.map((chapter, index) => (
                    <li key={index}>
                        <a href={`#${chapter.id}`}>{chapter.text}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArticleSummary;
