import React from 'react';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { uploadImage } from '@/src/utils/image-upload';

// Fix for Editor type issue
const TinyMCEEditor = Editor as unknown as React.ComponentType<Partial<IAllProps>>;

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  id?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, id = 'content' }) => {
  return (
    <TinyMCEEditor
      id={id}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      init={{
        height: 600,
        menubar: 'file edit view insert format tools table',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'emoticons', 'paste'
        ],
        toolbar1: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | forecolor backcolor emoticons',
        toolbar2: 'styleselect | outdent indent | removeformat | code fullscreen | preview | help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 1rem;
          }
          p { margin: 0 0 1rem 0; }
          img { max-width: 100%; height: auto; }
          .mce-content-body img { display: block; margin: 0 auto; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 1rem; }
        `,
        formats: {
          alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,img', classes: 'text-left' },
          aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,img', classes: 'text-center' },
          alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,img', classes: 'text-right' },
          alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,img', classes: 'text-justify' }
        },
        language: 'vi',
        language_url: '/tinymce/langs/vi.js',
        paste_data_images: true,
        relative_urls: false,
        remove_script_host: true,
        convert_urls: true,
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: async (blobInfo: any, progress: any) => {
          try {
            const result = await uploadImage(blobInfo.blob(), progress);
            if (result.error) {
              throw new Error(result.error);
            }
            return result.url;
          } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
          }
        }
      }}
      value={value}
      onEditorChange={onChange}
    />
  );
};

export default RichTextEditor;