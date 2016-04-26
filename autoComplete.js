var autoComplete = function () {

	var defaults = {
		textAreaID: 'auto-textarea',
		divID: 'auto-div',
		promptID: 'auto-prompt-div',
		promptClass: 'auto-prompt-div',
		promptNodeID: 'prompt-node',
		promptNodeClass: 'prompt-node',
		selNodeDiv: 'selected-node',
		selNodeClass: 'selected-node',
		selNodeOrder: 0,
		selObjLimitNum: 0,
		dataArray: [],
		remainPadding: 30,
		selDataArray: []
	};
	
	var cursor = 0, cursorForMEvent = 0, matchItemArray = [];

	var prompt = {
		load: function (data) {
			
			if (data) {
				// Load Json data
				var jsonData = JSON.parse(data);
				var secondArrayKey = '';
				for (var key in jsonData[0]) {
					secondArrayKey = key;
					break;
				}
				if (secondArrayKey != '') {
					for (var i = 0; i < jsonData.length; i++) {
						defaults.dataArray[i] = [jsonData[i][secondArrayKey], 1];
					}
				} else {
					for (var i = 0; i < jsonData.length; i++) {
						defaults.dataArray[i] = [jsonData[i], 1];
					}
				}
				
			}
		},
		remove: function () {
			if (document.getElementById(defaults.promptID)) {
			
				if (!document.getElementById(defaults.promptID).remove) { //IE
					document.getElementById(defaults.promptID).removeNode(true);
				} else {
					document.getElementById(defaults.promptID).remove();
				}				
			}
		},
		show: function () {

			if (!prompt.remove) {
				prompt.removeNode(true);
			} else {
				prompt.remove();
			}
			

			var dataArray = defaults.dataArray;
			var eleDiv = document.createElement('div');
			var textAreaVal = textArea.toString();
			var dataLen = dataArray.length;

			if (textAreaVal !== '') {
				eleDiv.setAttribute('id', defaults.promptID);
				eleDiv.setAttribute('class', defaults.promptClass);
				eleDiv.setAttribute('style', 'width:' + (inputDiv.getWidth() - 5) + 'px');
				matchItemArray = [];
				for (var i = 0; i < dataLen; i++) {

					if (dataArray[i][0] == null){
						break;
					}
					if (dataArray[i][0].substr(0, textAreaVal.length).toUpperCase() === (String(textAreaVal).toUpperCase()) 
						&& dataArray[i][1] == 1) {
						matchItemArray.push(i);
						var str = dataArray[i][0].substr(0, textAreaVal.length);
						var eleNodeDiv = document.createElement('div');
						var eleStyleBold = document.createElement('strong');
						var partOfEleText0 = document.createTextNode(str);
						var partOfEleText1 = document.createTextNode(dataArray[i][0].replace(str,''));
						
						eleStyleBold.appendChild(partOfEleText0);
						eleNodeDiv.setAttribute('id', defaults.promptNodeID + '-'+ i);
						eleNodeDiv.setAttribute('class', defaults.promptNodeClass);
						eleNodeDiv.appendChild(eleStyleBold);
						eleNodeDiv.appendChild(partOfEleText1);
						eleDiv.appendChild(eleNodeDiv);
						document.getElementById(defaults.divID).parentNode.appendChild(eleDiv);
						
						// Hint data onclick event
						document.getElementById(defaults.promptNodeID + '-'+ i).onclick = function() {
							var tmpID = this.id;
							var idArray = (this.id).split('-');
							var id = idArray[idArray.length-1];
							cursorForMEvent = 0;
							selectedObj.set(dataArray[id][0]);
						}
						
						// Hint data mouseover event
						document.getElementById(defaults.promptNodeID + '-'+ i).onmouseover = function() {
							var tmpID = this.id;
							var idArray = tmpID.split('-');
							
							// CSS
							for (var i = 0; i < document.getElementById(defaults.promptID).childNodes.length; i++) {
								document.getElementById(defaults.promptID).childNodes[i].style.backgroundColor = '';
							}
							if (matchItemArray[cursor]) {
								document.getElementById(defaults.promptNodeID + '-'+ matchItemArray[cursor]).style.backgroundColor = 'background-color: transparent;';
							}
							
							// Set cursor
							for (var j = 0; j < matchItemArray.length; j++) {
								if (matchItemArray[j] == idArray[idArray.length-1]) {
									cursor = j;
								}
							}
						}
					}
				}
				
			}
		}
	}; 
			
	var selectedObj = {
		set:  function (areaValue) {
		if ((document.getElementById(defaults.divID).childNodes.length)-1 < defaults.selObjLimitNum || defaults.selObjLimitNum == 0){

			var selObj = document.createElement('div');
			var selObjText = document.createElement('span');
			var delImgObj = document.createElement('img');
			var areaValueText = document.createTextNode(areaValue);
			var autoDiv = document.getElementById(defaults.divID);
			var divWidth = inputDiv.getWidth();
			
			selObjText.appendChild(areaValueText);
			delImgObj.setAttribute('id', 'img-' + defaults.selNodeDiv + '-' + defaults.selNodeOrder);
			delImgObj.setAttribute('src', '/images/btn-del-grey.png');

			selObj.setAttribute('id', defaults.selNodeDiv + '-' + defaults.selNodeOrder);
			selObj.setAttribute('class', defaults.selNodeClass);						
			selObj.appendChild(selObjText);
			selObj.appendChild(delImgObj);
			
			// Insert selected object before textarea object
			autoDiv.insertBefore(selObj, autoDiv.childNodes[(autoDiv.childNodes.length-1)]);
			
			// Set selObjText max-width
			selObjText.setAttribute('style', 'max-width:' + (divWidth - selectedObj.getDelImgWidth() - 15) + 'px');
	
			// Init delete img event
			document.getElementById('img-' + defaults.selNodeDiv + '-' + defaults.selNodeOrder).onclick = function (){
				var tmpID = this.id;
				var idArray = tmpID.split('-');
				var id = idArray[idArray.length-1];
				selectedObj.remove(id);
				prompt.remove();

				if ((document.getElementById(defaults.divID).childNodes.length) == 1) {
					defaults.selNodeOrder = 0;
				}
			};			
			
			// Set selDataArray
			defaults.selDataArray[defaults.selNodeOrder] = areaValue;
			defaults.selNodeOrder ++;
			
			// Clear textarea
			document.getElementById(defaults.textAreaID).value = '';
			
			// Set textarea width
			textArea.setWidth(1);
			
			// Process hint data
			if (document.getElementById(defaults.promptID)) {
				var c = cursor - cursorForMEvent;
				if (c == -1) {
					c = 0;
				}
				if (matchItemArray.length != 0
					&& areaValue == defaults.dataArray[matchItemArray[c]][0] 
					&& defaults.dataArray[matchItemArray[c]][1] != 0) {
					defaults.dataArray[matchItemArray[c]][1] = 0;
				}
				prompt.remove();
			}
		}
		},
		remove: function (id) {
			var selNodeOrder = id;
			var dataArray = defaults.dataArray;
			var selDataArray = defaults.selDataArray;
			var selElement = document.getElementById(defaults.selNodeDiv + '-' + selNodeOrder);

			// Show
			for (var i in dataArray) {
				var val0 = String(dataArray[i][0]);
				var val1 = String((selElement.textContent));
				if (val0 == val1) {
					dataArray[i][1] = 1; 
				}
			}
			
			
			// Delete selected data
			delete selDataArray[selNodeOrder];

			if (!selElement.remove) { //IE
				selElement.removeNode(true);
			} else {
				
				selElement.remove();
			}		

			// If delete last record
			if (selNodeOrder === (defaults.selNodeOrder - 1)) {
				defaults.selNodeOrder --;
			}

			textArea.setWidth(0);
		},
		getDelImgWidth: function () {
			var childNode, childNodeStyleLeft, childNodeStyleRight, width = 0;
			childNode = document.getElementById('img-' + defaults.selNodeDiv + '-' + defaults.selNodeOrder);
			childNodeStyleLeft = (window.getComputedStyle(childNode).marginLeft).replace('px','');
			childNodeStyleRight = (window.getComputedStyle(childNode).marginRight).replace('px','');
			width = parseInt(childNode.offsetWidth) + parseInt(childNodeStyleLeft) + parseInt(childNodeStyleRight);
			return width;
		},
		getWidth: function () {
			var childNode, childNodeStyleLeft, childNodeStyleRight, width = 0;
			for (var i = 0; i < defaults.selNodeOrder; i ++) {
				childNode = document.getElementById(defaults.selNodeDiv + '-' + i);
				if (childNode) {
					childNodeStyleLeft = (window.getComputedStyle(childNode).marginLeft).replace('px','');
					childNodeStyleRight = (window.getComputedStyle(childNode).marginRight).replace('px','');
					width += parseInt(childNode.offsetWidth) + parseInt(childNodeStyleLeft) + parseInt(childNodeStyleRight);
				} else {
					width += 0;
				}
			}
			
			return width;
		},
		getHeight: function () {
			var childNode, childNodeStyleTop, childNodeStyleBottom, height = 0;
			
			childNode = document.getElementById(defaults.selNodeDiv + '-0');
			childNodeStyleTop = (window.getComputedStyle(childNode).marginTop).replace('px','');
			childNodeStyleBottom = (window.getComputedStyle(childNode).marginBottom).replace('px','');
			height = parseInt(childNode.offsetHeight) + parseInt(childNodeStyleTop) + parseInt(childNodeStyleBottom);		
	
			return height;
		},
		getWidthArray: function () {
			// offsetWidth and offsetHeight
			// The width and height of the entire element, including borders and padding, excluding margins.
			var childNode, childNodeStyleLeft, childNodeStyleRight, widthArray = [];
			for (var i = 0; i < defaults.selNodeOrder; i ++) {
				childNode = document.getElementById(defaults.selNodeDiv + '-' + i);
				if (childNode) {
					childNodeStyleLeft = (window.getComputedStyle(childNode).marginLeft).replace('px','');
					childNodeStyleRight = (window.getComputedStyle(childNode).marginRight).replace('px','');
					widthArray[i] = (parseInt(childNode.offsetWidth) + parseInt(childNodeStyleLeft) + parseInt(childNodeStyleRight));
				} else {
					widthArray[i] = 0;
				}
			}
			return widthArray;
		}
	};
		
	var inputDiv = {
		init: function (id) {
			document.getElementById(id).setAttribute('style', 'width:300px;min-height:30px;border:1px solid;display:table;');
			textArea.init(); 
		},
		getWidth: function () {	
			return parseInt((window.getComputedStyle(document.getElementById(defaults.divID)).width).replace('px', ''));
		},
		getHeight: function () {	
			return parseInt((window.getComputedStyle(document.getElementById(defaults.divID)).height).replace('px', ''));
		}
	};
	
			
	var keyEvent = {
		/*
		 *	You shouldn't use the keypress event, but the keyup or keydown event because the keypress event is intended for real (printable) characters. 
		 *	keydown is handled at a lower level so it will capture all nonprinting keys like delete and enter.
		 */
		down: function (event) {
			var keyCode = event.keyCode;
			var areaValue = textArea.toString();
			
			if (event.which == null) {
				keyCode = event.keyCode;
			} else if (event.which != 0 && event.charCode == 0) {
				keyCode = event.which;
			} else {
				keyCode = null;
			}	

			switch (keyCode) {
				case 8: // Backspace
					if (areaValue == '' && document.getElementById(defaults.divID).childNodes.length > 1) {
						event.preventDefault();
						var tmpID = document.getElementById(defaults.divID).childNodes[document.getElementById(defaults.divID).childNodes.length-2].id;
						if (tmpID) {
							var idArray = tmpID.split('-');
							var id = idArray[idArray.length-1];
							selectedObj.remove(id);
							prompt.remove();
						} else {
							defaults.selNodeOrder = 0;
						}	
					}
				break;
				case 13: // Enter
					event.preventDefault();
				break;
			}
		},
		up: function (event) {
			var keyCode = event.keyCode;
			var areaValue = textArea.toString();
			
			if (event.which == null) {
				keyCode = event.keyCode;
			} else if (event.which != 0 && event.charCode == 0) {
				keyCode = event.which;
			} else {
				keyCode = null;
			}

			switch (keyCode) {
				case 8: // Backspace
					matchItemArray = [];
					cursor = 0;
					if (areaValue != '') {
						prompt.show();
					}  else if (areaValue == '') {
						prompt.remove();
					}
				break;
				case 13: // Enter
					event.preventDefault();
					if (areaValue != '') {
						selectedObj.set(areaValue);
					}
					matchItemArray = [];
					cursor = 0;
				break;
				case 38: // Up arrow
					event.preventDefault();
					if (document.getElementById(defaults.promptID) && matchItemArray.length != 0) {
						if (areaValue != '') {
							if (cursor > 0 && cursor <= (matchItemArray.length-1)) {
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor-1]).setAttribute('style', 'background-color: rgba(220,220,220,0.5);');
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).setAttribute('style', 'background-color: transparent;');
								document.getElementById(defaults.textAreaID).value = document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor-1]).textContent;
							} else if (cursor == 0) {
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).setAttribute('style', 'background-color: rgba(220,220,220,0.5);');
								document.getElementById(defaults.textAreaID).value = document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).textContent;
							}
							
							if (cursor > 0) {
								cursor--;
								cursorForMEvent = -1;
							} else {
								cursorForMEvent = 0;
							}
						}
					}
				break;
				case 40: // Down arrow
					event.preventDefault();
					if (document.getElementById(defaults.promptID) && matchItemArray.length != 0) {
						if (areaValue != '') {
							if (cursor > 0) {
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor-1]).setAttribute('style', 'background-color: transparent;');
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).setAttribute('style', 'background-color: rgba(220,220,220,0.5);');
							} else if (cursor == 0) {
								document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).setAttribute('style', 'background-color: rgba(220,220,220,0.5);');
							}
							document.getElementById(defaults.textAreaID).value = document.getElementById(defaults.promptNodeID + '-' + matchItemArray[cursor]).textContent;
							if (cursor < (matchItemArray.length-1)) {
								cursor++;
								cursorForMEvent = 1;
							} else {
								cursorForMEvent = 0;
							}
						}
					}
				break;
				case 46: // Delete
					matchItemArray = [];
					cursor = 0;
					if (textArea.toString() != '') {
						prompt.show();
					} else {
						prompt.remove();
					}
				break;
				default:
					prompt.show();
			}
		}				
	};
	
	
	var textArea = {
		params: {
			line: 1, 
			index: 0, 
			remainWidth: 0
		},
		init: function () {
			var ta = document.createElement('textarea');
			ta.setAttribute('id', defaults.textAreaID);
			ta.setAttribute('name', defaults.textAreaID);
			document.getElementById(defaults.divID).appendChild(ta);
			textArea.initKeyEvent();
		},
		initKeyEvent: function () {
			// Get key event
			document.getElementById(defaults.textAreaID).onkeyup = keyEvent.up;
			document.getElementById(defaults.textAreaID).onkeydown = keyEvent.down;	
			
			// Clear auto hint div
			document.getElementById(defaults.textAreaID).onclick = function (){
				prompt.remove();
			};
		},
		setWidth: function (type) {
		
			/* 
			 *	type = 0 means from delete element event; 
			 *  type = 1 means from add element event
			 *
			 */
			if (type == 0) {
				// Reset value
				textArea.params.line = 1;
				textArea.params.index = 0;
				textArea.params.remainWidth = 0;
			}
			
			var selWidthArray = selectedObj.getWidthArray();
			var divWidth = inputDiv.getWidth();
			var prevWidth = divWidth*(textArea.params.line-1);

			for (var i = textArea.params.index; i < (selWidthArray.length); i++) {
				prevWidth += parseInt(selWidthArray[i]);
				if (prevWidth >= divWidth*(textArea.params.line)) {
					textArea.params.line ++;
					if (type == 0) {
						prevWidth = divWidth*(textArea.params.line-1) + parseInt(selWidthArray[i]);
					}
					textArea.params.remainWidth = divWidth - parseInt(selWidthArray[i]);		
					textArea.params.index = i;
				} else {
					textArea.params.remainWidth = divWidth*textArea.params.line - prevWidth;
				}
			}
			
			if (prevWidth >= 0 && textArea.params.remainWidth <= defaults.remainPadding) {
				textArea.params.remainWidth = divWidth;
			} else {
				textArea.params.remainWidth = (textArea.params.remainWidth - defaults.remainPadding);
			}
			document.getElementById(defaults.textAreaID).style.width = textArea.params.remainWidth + 'px';
		},
		setHeight: function () {
		
		},
		getWidth: function () {
			return parseInt((window.getComputedStyle(document.getElementById(defaults.textAreaID)).width).replace('px', ''));
		},
		getHeight: function () {
			return parseInt((window.getComputedStyle(document.getElementById(defaults.textAreaID)).height).replace('px', ''));
		},
		toString: function () {
			return String(document.getElementById(defaults.textAreaID).value);
		}
	};
	
	function init() {

	}
	
	return {
		init: init(),
		setDivID: function(id) {
			if (id != '') {
				defaults.divID = id;
			}
			inputDiv.init(id);
		},
		setPromptData: prompt.load,
		setLimit: function (num) {
			defaults.selObjLimitNum = num;
		}
	};
};
