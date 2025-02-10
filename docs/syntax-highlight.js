{
  const styles = document.createElement('link');
  styles.href = './syntax-highlight.css';
  styles.type = 'text/css';
  styles.rel = 'stylesheet';
  document.head.appendChild(styles);

  const prismjs = document.createElement('script');
  prismjs.src = 'https://unpkg.com/prismjs@1.29.0/prism.js';
  prismjs.setAttribute('data-manual', '');
  prismjs.setAttribute('async', '');
  prismjs.onload = setup;
  document.head.appendChild(prismjs);

  function setup() {
    // Register all token types
    const tokenTypes = [
      'atrule',
      'attr',
      'attr',
      'bold',
      'boolean',
      'builtin',
      'cdata',
      'char',
      'class',
      'class-name',
      'comment',
      'constant',
      'deleted',
      'doctype',
      'entity',
      'entity',
      'function',
      'important',
      'important',
      'inserted',
      'italic',
      'keyword',
      'namespace',
      'number',
      'operator',
      'parameter',
      'prolog',
      'property',
      'punctuation',
      'regex',
      'selector',
      'string',
      'string',
      'symbol',
      'tag',
      'url',
      'variable',
    ];

    for (const tokenType of tokenTypes) {
      CSS.highlights.set(tokenType, new Highlight());
    }

    // Loop all tokens and paint highlights based on their type
    const paintTokenHighlights = (codeBlock, tokens) => {
      let pos = 0;
      for (const token of tokens) {
        if (token.type) {
          const range = new Range();
          range.setStart(codeBlock.firstChild, pos);
          range.setEnd(codeBlock.firstChild, pos + token.length);
          CSS.highlights.get(token.alias ?? token.type)?.add(range);
        }
        pos += token.length;
      }
    };

    const highlightStatic = (codeBlock, lang = window.Prism.languages.plain) => {
      // Tokenize the code
      const tokens = window.Prism.tokenize(codeBlock.innerText, lang);
      // Paint all token highlights
      paintTokenHighlights(codeBlock, tokens);
    };

    // Highlight static code blocks
    const codeBlocks = document.querySelectorAll('[data-lang]:not(#playground-css)');
    for (const codeBlock of codeBlocks) {
      const lang = window.Prism.languages[codeBlock.dataset.lang] || undefined;
      highlightStatic(codeBlock, lang);
    }
  }
}
