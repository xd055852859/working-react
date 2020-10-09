import React from 'react';
import './Editor.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/languages/zh_cn';
import 'froala-editor/js/plugins/align.min';
import 'froala-editor/js/plugins/char_counter.min';
import 'froala-editor/js/plugins/code_beautifier.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/colors.min';
import 'froala-editor/js/plugins/draggable.min';
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/plugins/font_family.min';
import 'froala-editor/js/plugins/font_size.min';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/image.min';
import 'froala-editor/js/plugins/image_manager.min';
import 'froala-editor/js/plugins/inline_style.min';
import 'froala-editor/js/plugins/line_breaker.min';
import 'froala-editor/js/plugins/link.min';
import 'froala-editor/js/plugins/lists.min';
import 'froala-editor/js/plugins/paragraph_format.min';
import 'froala-editor/js/plugins/paragraph_style.min';
import 'froala-editor/js/plugins/quick_insert.min';
import 'froala-editor/js/plugins/quote.min';
import 'froala-editor/js/plugins/save.min';
import 'froala-editor/js/plugins/table.min';
import 'froala-editor/js/plugins/url.min';
import 'froala-editor/js/plugins/video.min';
import 'froala-editor/js/plugins/word_paste.min';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import uploadFile from './upload';
// import ArticleTree from "./ArticleTree";

interface EditorProps {
  data: string;
  editable: boolean;
  onChange?: Function;
  editorHeight?: string;
  editorState?: boolean;
  setInit?: any;
}
const Editor: React.FC<EditorProps> = (prop) => {
  const { data, editable, onChange, editorHeight, editorState, setInit } = prop;
  const uptoken = useTypedSelector((state) => state.auth.uploadToken);
  let selectedFile: any;

  const events = {
    initialized: function () {
      // Do something here.
      // this is the editor instance.
      if (editorState) {
        setInit();
      }
    },
    'image.inserted': async function ($img: any, response: any) {
      // get a file or blob from an blob url
      let blob = await fetch($img[0].src).then((r) => r.blob());
      uploadFile.qiniuUpload(uptoken, $img[0], blob, false);
    },
    'video.beforeUpload': function (videos: any) {
      // Return false if you want to stop the video upload.
      selectedFile = videos[0];
    },
    'video.inserted': function ($video: any) {
      uploadFile.qiniuUpload(uptoken, $video[0], selectedFile, true);
    },
  };

  const config = {
    placeholder: 'Edit Me',
    documentReady: editorState ? true : false,
    language: 'zh_cn',
    // iframe: true,
    toolbarSticky: editorState ? true : false,
    events: events,
    height: editorHeight,
    // toolbarButtons: [
    //   ['undo', 'redo'],
    //   ['paragraphFormat', 'fontFamily', 'fontSize'],
    //   [
    //     'bold',
    //     'italic',
    //     'underline',
    //     'strikeThrough',
    //     'textColor',
    //     'backgroundColor',
    //   ],
    //   ['formatOL', 'formatUL', 'align'],
    //   ['insertImage', 'insertVideo', 'insertTable', 'insertLink'],
    // ],

    // // Change buttons for XS screen.
    // toolbarButtonsXS: [
    //   ['undo', 'redo'],
    //   ['bold', 'insertImage', 'insertVideo'],
    // ],
    toolbarButtons: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          // "fontFamily",
          'fontSize',
          // "textColor",
          // "backgroundColor",
          // "inlineClass",
          // "inlineStyle",
          // "clearFormatting",
        ],
      },
      moreParagraph: {
        buttons: [
          'paragraphFormat',
          // "paragraphStyle",
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'lineHeight',
          'outdent',
          'indent',
          // "quote",
        ],
      },
      moreRich: {
        buttons: [
          'fullscreen',
          'insertImage',
          'insertVideo',
          'insertLink',
          'insertTable',
          'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
        ],
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'alert'],
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#efefef', width: '100%' }}>
      {editable ? (
        <FroalaEditor config={config} model={data} onModelChange={onChange} />
      ) : (
        <div className="editor-preview" style={{ height: editorHeight }}>
          <FroalaEditorView model={data} />
        </div>
      )}
      {/* <ArticleTree data={data} /> */}
    </div>
  );
};

export default Editor;
