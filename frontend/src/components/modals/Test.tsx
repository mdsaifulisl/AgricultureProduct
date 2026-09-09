import { useState } from 'react';
import { RichTextEditor } from '../common/RichTextEditor';

export const Test = () => {
  const [description, setDescription] = useState('');

  return (
    <form className="max-w-3xl mx-auto p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-xl font-bold text-gray-800">Test Rich Text Editor</h2>
      
      <RichTextEditor
        content={description}
        onChange={(html) => setDescription(html)}
        /* ব্যাকএন্ড ছাড়া লোকাল UI টেস্ট করার জন্য onImageUpload প্রপস দেওয়ার প্রয়োজন নেই */
      />

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-600 mb-2">Output HTML preview:</h3>
        <p className="text-xs break-all font-mono text-gray-700">{description}</p>
      </div>
    </form>
  );
};

export default Test;