import React, { useState, useEffect } from 'react';
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
import { qiniuUpload } from './qiniu';
import format from './format';

// import ArticleTree from "./ArticleTree";
const Froalaeditor = require('froala-editor');
interface EditorProps {
  data: string;
  editable: boolean;
  onChange?: Function;
  editorHeight?: string;
  editorState?: boolean;
  setInit?: any;
  fullType?: string;
  changeIsEdit?: any;
}
const Editor: React.FC<EditorProps> = (prop) => {
  const {
    data,
    editable,
    onChange,
    editorHeight,
    editorState,
    setInit,
    fullType,
    changeIsEdit,
  } = prop;
  const uptoken = useTypedSelector((state) => state.auth.uploadToken);
  const [loading, setLoading] = useState(false);
  let selectedFile: any;
  useEffect(() => {
    Froalaeditor.DefineIcon('clearFormatting', {
      NAME: 'clearFormatting',
      SVG_KEY: 'clearFormatting',
    });
    Froalaeditor.RegisterCommand('clearFormatting', {
      title: '清除格式',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
        let html = this.html.get();
        // let clear = this.html.getSelected();
        // clear = clear.replace(/<\/?.+?>/g, '');
        // clear = clear.replace(/&nbsp;/g, '');
        // this.html.set(html.replace(this.html.getSelected(), clear));

        // let sections = html.split('</p>');
        let sections = html.split(
          /<\/p>|<\/div>|<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|<\/ol>|<\/li>/
        );
        for (let i = 0; i < sections.length; i++) {
          let sectionStr = sections[i];
          const isImg = sectionStr.indexOf('<img') !== -1 ? true : false;
          if (!isImg) {
            // 去除标签
            sectionStr = sectionStr.replace(/<\/?.+?>/g, '');
            sectionStr = sectionStr.replace(/&nbsp;/g, '');
            if (sectionStr) {
              sections[i] = `<p>${sectionStr}</p>`;
            }
          } else {
            let imageUrl = sectionStr.match(/src=['"]?([^'"]*)['"]?/i)[1];
            sections[
              i
            ] = `<img src="${imageUrl}" style="width: 100%;" class="fr-fic fr-dib fr-draggable"></img>`;
          }
        }
        this.html.set(sections.join(''));
      },
    });
  }, []);

  // useEffect(() => {
  //   let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  //   let arr:any = data.match(srcReg);
  //   if (arr.indexOf('blob') !== -1) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [data]);

  const events = {
    initialized: function () {
      // Do something here.
      // this is the editor instance.
      if (editorState) {
        setInit();
        console.log(changeIsEdit);
      }
    },
    focus: function () {
      console.log(changeIsEdit);
      if (changeIsEdit) {
        changeIsEdit(true);
      }
    },
    blur: function () {
      if (changeIsEdit) {
        changeIsEdit(false);
      }
    },
    'image.inserted': async function ($img: any, response: any) {
      // get a file or blob from an blob url
      let blob = await fetch($img[0].src).then((r) => r.blob());
      qiniuUpload(uptoken, $img[0], blob, false);
    },
    'video.beforeUpload': function (videos: any) {
      // Return false if you want to stop the video upload.
      selectedFile = videos[0];
    },
    'video.inserted': function ($video: any) {
      qiniuUpload(uptoken, $video[0], selectedFile, true);
    },
  };

  const config = {
    placeholder: 'Edit Me',
    documentReady: editorState ? true : false,
    // language: 'zh_cn',
    // iframe: true,
    // toolbarSticky: editorState ? true : false,
    // events: events,
    height: editorHeight ? editorHeight : '300px',
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
    // toolbarButtons: {
    //   moreText: {
    //     buttons: [
    //       'bold',
    //       'italic',
    //       'underline',
    //       'strikeThrough',
    //       'subscript',
    //       'superscript',
    //       // "fontFamily",
    //       'fontSize',
    //       // "textColor",
    //       // "backgroundColor",
    //       // "inlineClass",
    //       // "inlineStyle",
    //       // "clearFormatting",
    //     ],
    //   },
    //   moreParagraph: {
    //     buttons: [
    //       'paragraphFormat',
    //       // "paragraphStyle",
    //       'alignLeft',
    //       'alignCenter',
    //       'formatOLSimple',
    //       'alignRight',
    //       'alignJustify',
    //       'formatOL',
    //       'formatUL',
    //       'lineHeight',
    //       'outdent',
    //       'indent',
    //       // "quote",
    //     ],
    //   },
    //   moreRich: {
    //     buttons: [
    //       'fullscreen',
    //       'insertImage',
    //       'insertVideo',
    //       'insertLink',
    //       'insertTable',
    //       'emoticons',
    //       'fontAwesome',
    //       'specialCharacters',
    //       'embedly',
    //       'insertFile',
    //       'insertHR',
    //     ],
    //   },
    //   moreMisc: {
    //     buttons: ['undo', 'redo', 'alert'],
    //   },
    // toolbarInline: true,
    language: 'zh_cn',
    // iframe: true,
    events: events,
    toolbarButtons:
      fullType === 'big'
        ? [
            ['undo', 'redo'],
            ['paragraphFormat', 'fontFamily', 'fontSize'],
            [
              'bold',
              'italic',
              'underline',
              'strikeThrough',
              'textColor',
              'clearFormatting',
              'backgroundColor',
            ],
            ['formatOL', 'formatUL', 'align'],
            ['insertImage', 'insertVideo', 'insertTable', 'insertLink'],
          ]
        : [
            [
              'undo',
              'redo',
              'paragraphFormat',
              'formatOL',
              'formatUL',
              'align',
              'insertImage',
            ],
          ],

    // Change buttons for XS screen.
    // SVG_KEY在https://github.com/froala/wysiwyg-editor/issues/3478
    // toolbarButtonsXS: [['undo', 'redo', 'paragraphFormat', 'formatOL', 'formatUL', 'align', 'insertImage']],
  };
  return (
    <div style={{ backgroundColor: '#efefef', width: '100%' }}>
      {/* {loading ? <Loading /> : null} */}
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
