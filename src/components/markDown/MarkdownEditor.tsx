import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import Button from '@material-ui/core/Button';

interface MarkdownEditorProps {
  nodeKey?: string;
  data?: any;
  title?: string;
  onChange?: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      display: 'flex',
      width: '100%',
      height: '100%',
      fontSize: '14px',
    },
    editorWrapper: {
      width: '50%',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#949596',
        outline: '1px solid slategrey',
      },
    },
    viewerWrapper: {
      width: '50%',
      padding: '0 15px',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#949596',
        outline: '1px solid slategrey',
      },
    },
  })
);

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { nodeKey, data, title, onChange } = props;

  const classes = useStyles();
  const [input, setInput] = useState(
    data || `# ${title}\n请输入正文\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
  );

  useEffect(() => {
    setInput(
      data || `# ${title}\n请输入正文\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
    );
  }, [data, title]);
  useEffect(() => {
    onChange(input);
  }, [input]);
  return (
    <div className={classes.editor}>
      <div className={classes.editorWrapper}>
        {input && typeof input === 'string' ? (
          <CodeMirror
            value={input}
            options={{
              mode: 'markdown',
              theme: 'material',
              lineNumbers: true,
              lineWrapping: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setInput(value);
            }}
            // onChange={(editor, metadata, value) => {}}
          />
        ) : null}
      </div>
      <div className={classes.viewerWrapper} id="editor-preview">
        {input && typeof input === 'string' ? (
          <ReactMarkdown
            source={input}
            // skipHtml={false}
            escapeHtml={false}
            renderers={{ code: CodeBlock }}
          />
        ) : null}
      </div>
    </div>
  );
};
MarkdownEditor.defaultProps = {};
export default MarkdownEditor;
