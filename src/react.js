// eslint-disable-next-line no-unused-vars
import React from 'react';
import addons from '@storybook/addons';

const WithSource = () => {
  const { children, source } = this.props;
  const channel = addons.getChannel();

  channel.emit('storybook/notes/add_source', source);

  return children;
};

WithSource.defaultProps = {
  children: null,
  notes: '',
};
