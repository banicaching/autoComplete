# autoComplete
Simple autoComplete function with native javascript 

## How to use?

#### Load autoComplete.css

```html
  <link href="autoComplete.css" rel="stylesheet" type="text/css"/>
```

#### Load autoComplete.js
```html
  <script type="text/javascript" src="autoComplete.js"></script>
```

#### Put a div in body

```html
  <body>
  	<div id='aaa'></div>
  </body>
```
#### Write the init code
- Init module
- Setup div id
- Setup prompt data (Optional)
- Setup selected data limit (Optional)

```html 
  <script type="text/javascript">
    var ac = autoComplete();
    ac.setDivID('aaa');
    ac.setPromptData(data);
    ac.setLimit(3);
  </script>
```
