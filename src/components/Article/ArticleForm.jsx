// components/Article/ArticleForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function ArticleForm({ 
    initialTitle, 
    initialContent, 
    initialSummary, 
    initialType, 
    initialEventDate, 
    initialTags,
    initialReadingTime,
    initialReferences = [],
    onSubmit, 
    isUpdate = false, 
    articleId = null }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [content, setContent] = useState(initialContent || '');
    const [summary, setSummary] = useState(initialSummary || '');
    const [type, setType] = useState(initialType || '');
    const [tags, setTags] = useState(initialTags ? initialTags.join(', ') : '');
    const [readingTime, setReadingTime] = useState(initialReadingTime || '');
    const [eventDate, setEventDate] = useState(initialEventDate || '');
    const [showEventDate, setShowEventDate] = useState(initialType === 'EVENT');
    const [references, setReferences] = useState(initialReferences || '');
    const [articleTypes, setArticleTypes] = useState([]);

    useEffect(() => {
        const fetchArticleTypes = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:8080/article-types', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setArticleTypes(response.data);
            } catch (error) {
                console.error('Failed to fetch article types:', error);
            }
        };

        fetchArticleTypes();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        const tagsArray = tags.split(',').map(tag => tag.trim());
        const articleData = { 
            title, 
            content, 
            summary, 
            type, 
            eventDate: showEventDate ? eventDate : null, 
            tags: tagsArray, 
            readingTime: parseInt(readingTime, 10),
            references,
        };
        try {
            const url = isUpdate ? `http://localhost:8080/articles/${articleId}` : 'http://localhost:8080/articles';
            const method = isUpdate ? 'put' : 'post';
            const response = await axios({
                method: method,
                url: url,
                data: articleData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onSubmit(response.data);
        } catch (error) {
            console.error('Failed to submit article:', error.response ? error.response.data : error);
            alert(`Failed to submit article: ${error.response ? error.response.data : 'Error details not available'}`);
        }
    };

    const handleAddReference = () => {
        setReferences([...references, { referenceText: '', url: '' }]);
    };

    const handleRemoveReference = (index) => {
        const newReferences = references.filter((_, i) => i !== index);
        setReferences(newReferences);
    };

    const handleReferenceChange = (index, field, value) => {
        const newReferences = references.map((ref, i) => (
            i === index ? { ...ref, [field]: value } : ref
        ));
        setReferences(newReferences);
    };


    useEffect(() => {
        setShowEventDate(type === 'EVENT');
    }, [type]);

    useEffect(() => {
        setType(initialType || '');
    }, [initialType]);
    

    return (
        <form className="article-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <label htmlFor="content">Content</label>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
                config={{
                    ckfinder: {
                        uploadUrl: 'http://localhost:8080/upload',
                        options: {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                            }
                        }
                    }
                }}
            />
            <label htmlFor="summary">Summary</label>
            <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
            />
            <label htmlFor="type">Type</label>
            <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
            >
                <option value="">Select Type...</option>
                {articleTypes.map(articleType => (
                    <option key={articleType.name} value={articleType.name.toUpperCase().replace(' ', '_')}>
                        {articleType.name}
                    </option>
                ))}
            </select>
            {showEventDate && (
                <>
                    <label htmlFor="eventDate">Event Date</label>
                    <input
                        type="date"
                        id="eventDate"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                    />
                </>
            )}
            <label htmlFor="tags">Tags</label>
            <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
            />
            <label htmlFor="readingTime">Reading Time (minutes)</label>
            <input
                type="number"
                id="readingTime"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                required
            />
            <label htmlFor="references">References</label>
            {references.map((ref, index) => (
                <div key={index} className="reference-item">
                    <input
                        type="text"
                        placeholder="Reference Text"
                        value={ref.referenceText}
                        onChange={(e) => handleReferenceChange(index, 'referenceText', e.target.value)}
                    />
                    <input
                        type="url"
                        placeholder="URL"
                        value={ref.url}
                        onChange={(e) => handleReferenceChange(index, 'url', e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveReference(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddReference}>Add Reference</button>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ArticleForm;
