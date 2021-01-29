import './text-editor.css';
import { useState, useEffect } from 'react'
import * as rangy from 'rangy'

function TextEditor() {

  let [textData, setTextData] = useState(localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : []);
  let [selected, setSelected] = useState(null);

  if (textData.length == 0) {
    textData = [
      [{
        data: "My name is Aakifa. I'm a software engineer.",
        style: {
          'b': [[0, 4], [6, 8]],
          'i': [[0, 1]],
          'u': [[6, 9]]
        }
      }],
      [{
        data: "This is a text editor",
        style: {
          'b': [[0, 1]],
          'i': [[2, 4]],
          'u': [[6, 7], [10, 12]]
        }
      }]
    ];
  }

  window.onload = function () {
    rangy.init();
    console.log(rangy);
  };

  useEffect(() => {
    window.onload = function () {
      rangy.init();
      console.log(rangy);
    };
  })

  function getMarkup(text) {

    let dataToDisplay = "";
    let temp = text[0].data;
    for (let i = 0; i < temp.length; i++) {
      let startStyle = hasStartStyle(text[0].style, i);
      let endStyle = hasEndStyle(text[0].style, i);
      if (startStyle.length > 0 || endStyle.length > 0) {
        if (startStyle.length > 0) {
          startStyle.map(style => {
            dataToDisplay += "<" + style + ">"
          })
          dataToDisplay += temp[i];
        }
        if (endStyle.length > 0) {
          dataToDisplay += temp[i];
          endStyle.map(style => {
            dataToDisplay += "</" + style + ">"
          })
        }
      }
      else {
        dataToDisplay += temp[i];
      }
    }

    return { __html: dataToDisplay };
  };

  function hasStartStyle(style, index) {
    let startStyle = [];
    for (var key in style) {
      let obj = style[key];
      for (let i = 0; i < obj.length; i++) {
        if (obj[i][0] == index) {
          startStyle.push(key);
        }
      }
    }
    return startStyle;
  }

  function hasEndStyle(style, index) {
    let endStyle = [];
    for (var key in style) {
      let obj = style[key];
      for (let i = 0; i < obj.length; i++) {
        if (obj[i][1] == index) {
          endStyle.push(key);
        }
      }
    }
    return endStyle;
  }

  function updateStyle(style, index) {
    let startStyle = [];
    for (var key in style) {
      let obj = style[key];
      for (let i = 0; i < obj.length; i++) {
        if (obj[i][0] >= index && obj[i][1] <= index) {
          let index = obj[i][1] + 1;
          obj[i][1] = index;
        }
      }
    }
  }

  function getFirstRange() {
    var sel = rangy.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
  }

  function insertNodeAtRange(event, text, i) {
    var range = getFirstRange();
    if (range) {
      textData[i].data = event.currentTarget.innerText;
      updateStyle(textData[i].style, range.startOffset);
      setTextData(textData);
      localStorage.setItem("data", JSON.stringify(textData));
    }
  }

  function addToSelection(event, text, i) {
    setSelected(i);
  }

  function onApplyBold() {
    var range = getFirstRange();
    if(range) {
      if (textData[selected][0].style['b']) {
        textData[selected][0].style['b'].push([range.startOffset, range.endOffset]);
      }
      else {
        textData[selected][0].style['b'] = [];
        textData[selected][0].style['b'].push([range.startOffset, range.endOffset]);
      }
    }
    setTextData(textData);
    localStorage.setItem("data", JSON.stringify(textData));
  }

  function onApplyItalics() {
    var range = getFirstRange();
    if(range) {
      if (textData[selected][0].style['i']) {
        textData[selected][0].style['i'].push([range.startOffset, range.endOffset]);
      }
      else {
        textData[selected][0].style['i'] = [];
        textData[selected][0].style['i'].push([range.startOffset, range.endOffset]);
      }
    }
    setTextData(textData);
    localStorage.setItem("data", JSON.stringify(textData));
  }

  function onApplyUnderline() {
    var range = getFirstRange();
    if(range) {
      if (textData[selected][0].style['u']) {
        textData[selected][0].style['u'].push([range.startOffset, range.endOffset]);
      }
      else {
        textData[selected][0].style['u'] = [];
        textData[selected][0].style['u'].push([range.startOffset, range.endOffset]);
      }
    }
    setTextData(textData);
    localStorage.setItem("data", JSON.stringify(textData));
  }

  return (
    <div className="TextEditor">
      <div className="header">
        <button className="editorButton" onClick={onApplyBold}>
          B
          </button>
        <button className="editorButton" onClick={onApplyItalics}>
          I
          </button>
        <button className="editorButton" style={{ textDecoration: 'underline' }} onClick={onApplyUnderline}>
          U
        </button>
      </div>
      <div className="editor" >
        {
          textData.map((text, i) => {
            return (
              <p key={i} dangerouslySetInnerHTML={getMarkup(text)} contentEditable={true} onMouseUp={(event) => addToSelection(event, text, i)} onInput={(event) => insertNodeAtRange(event, text, i)} >
              </p>)
          })
        }
      </div>
    </div>
  );
}

export default TextEditor;