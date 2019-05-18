import React from 'react';
import addons from '@storybook/addons';

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import createElement from 'react-syntax-highlighter/dist/esm/create-element';

const highlighterTheme = {
  ...darcula,
  'pre[class*="language-"]': {
    ...darcula['pre[class*="language-"]'],
    margin: 'auto',
    width: 'auto',
    height: 'auto',
    minHeight: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    fontSize: 'inherit',
  },
  'code[class*="language-"]': {
    ...darcula['code[class*="language-"]'],
    margin: 0,
    fontFamily: 'inherit',
  },
};

SyntaxHighlighter.registerLanguage('jsx', jsx);

export default class Source extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { text: '' };
    this.onAddSource = this.onAddSource.bind(this);
    this.lineRenderer = this.lineRenderer.bind(this);
    this.createPart = this.createPart.bind(this);
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on('storybook/notes/add_source', this.onAddSource);

    this.stopListeningOnStory = api.onStory(() => {
      this.onAddSource('');
    });
  }

  // This is some cleanup tasks when the Source panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel } = this.props;
    channel.removeListener('storybook/notes/add_source', this.onAddSource);
  }

  onAddSource(text) {
    this.setState({ text });
  }

  createPart = (rows, stylesheet, useInlineStyles) =>
    rows.map((node, i) =>
      createElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`,
      })
    );

  lineRenderer({ rows, stylesheet, useInlineStyles }) {
    const { locationsMap, locationsKeys } = this.state;

    if (!locationsMap || !locationsKeys.length) {
      return this.createPart(rows, stylesheet, useInlineStyles);
    }

    const parts = this.createParts(rows, stylesheet, useInlineStyles);

    return <span>{parts}</span>;
  }

  render() {
    const { active } = this.props;
    const { text } = this.state;

    return active ? (
      <SyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        style={highlighterTheme}
        renderer={this.lineRenderer}
        customStyle={{
          width: '100%',
        }}
      >
        {text}
      </SyntaxHighlighter>
    ) : null;
  }
}

addons.register('storybook/source', (api) => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/source/panel', {
    title: 'Source',
    render: ({ active }) => (
      <Source channel={channel} api={api} active={active} />
    ),
  });
});
