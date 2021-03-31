# summernote-video-popover
A plugin for [Summernote editor](https://github.com/summernote/summernote/). Adds a simple video popover for adjusting size and float attributes, which functions exactly like image popover.
Supports summernote from v0.8.0 to v0.8.18.

### Installation
#### 1. Include JS
Include following code after including Summernote.
````html
<script src="summernote-video-popover.js"></script>
````

#### 2. Include CSS
Since video controls will block click event to Summernote editor, especially in Firefox which are covering the whole video element, making click event totally untriggerable. You might need to use the following stylesheets, letting click events pass directly to Summernote editor.
`````
.note-editor .note-editing-area video{
    pointer-events: none;
}
`````
These stylesheets are include in summernote-video-popover.css. You can include the following code to your html.
````html
<link rel="stylesheet" href="summernote-video-popover.css"/>
````