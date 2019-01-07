# rc-source-loader

This package can directly read the source code of the file. Without any conversion

### demo.js

```js
export default function generateErrorTemplate(err) {
  const strToHtml = (str) =>
    (str || '')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '')
      .replace(/'/g, "'")
      .replace(/\[(\d+)m/g, '')
      .replace(/ /g, ' ')
      .replace(/\n/g, '<br />');
  const template = `
          <!DOCTYPE html> 
          <html>
          <head>
          </head>
          <body>
            <div>
              ${strToHtml(err.toString()) || ''}
            </div>
          </body>
          </html>`;
  return template;
}
```

### Use

```
import demo from 'rrc-source-loader!./demo.js';
// Directly output the contents of this js
console.log(demo);
```
