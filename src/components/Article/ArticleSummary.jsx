import React from "react";
import "./ArticleSummary.css";

function ArticleSummary({ chapters }) {

    const handleChapterClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="article-summary">
            <h4>Summary</h4>
            <ul>
                {chapters.map((chapter, index) => (
                    <li key={index}>
                        <a
                            href={`#${chapter.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleChapterClick(chapter.id);
                            }}
                        >
                            {chapter.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArticleSummary;
