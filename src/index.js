import addons, { makeDecorator } from '@storybook/addons';

const withSource = makeDecorator({
  name: 'withSource',
  parameterName: 'source',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    const { code } =
      typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;

    if (!code) {
      throw new Error(
        'You must set of one of `code`  on the `source` parameter'
      );
    }

    channel.emit('storybook/notes/add_source', code);

    return getStory(context);
  },
});

export default withSource;
