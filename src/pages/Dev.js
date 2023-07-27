import { colors } from '@mui/material';
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock';

const theme = createTheme();

const CodeWithDescription = ({ description, code }) => {
  return (
    <div style={colors}>
      <p>{description}</p>
      <SyntaxHighlighter language="javascript" style={docco}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const code1 = `npm --registry https://registry.npm.taobao.org install lib`;

const code2 = `function add(a, b) {
  return a + b;
}`;

const TagForm = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Typography variant="h4">常用开发工具汇总</Typography>

        <Typography variant="body2">1. 使用淘宝源安装依赖库:</Typography>
        <CodeBlock language="javascript" code={code1} />

        <Typography variant="body2">2. 这个函数用于两个数字相加：</Typography>
        <CodeBlock language="javascript" code={code2} />
      </ThemeProvider>
    </div>
  );
};

export default TagForm;
