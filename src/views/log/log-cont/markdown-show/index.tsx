import React from "react";
import styles from "./index.module.scss";
import markdownIt from 'markdown-it'
// 挑选想用的 markdown 样式
import mdStyle from "./gitlab.module.scss";
// import hljs from 'highlight.js'
// import "highlight.js/styles/atom-one-dark-reasonable.css";

interface PropsType {
  logcont: string;
}

const MarkdownShow: React.FC<PropsType> = (props) => {
  const { logcont } = props;
  const md = new markdownIt({
    // 代码高亮，貌似加不上去
    // highlight: function (str: any, lang: any) {
    //   if (lang && hljs.getLanguage(lang)) {
    //     try {
    //       return hljs.highlight(lang, str).value;
    //     } catch (__) {}
    //   }
  
    //   return ''; // use external default escaping
    //   // return hljs.highlightAuto(str).value
    // }
  })

  return (
    <div
      className={`${styles.markdownShower} ${mdStyle.markdownShower}`}
      dangerouslySetInnerHTML={{
        __html: md.render(logcont)
      }}
    />
  );
};

export default MarkdownShow;
