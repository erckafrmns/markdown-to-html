/**PARSER */

class Parser {
    constructor(tokens) {
      this.tokens = tokens;
      this.index = 0;
      this.ast = { type: 'root', children: [] };
      this.customIDs = new Set(); // Set to track custom IDs
    }
  
    parse() {
  
      // Remove blockquote's '>' symbol, important for lists in blockquote
      this.tokens = this.tokens.map(token => {
        if (token.type === 'blockquote') {
            token.value = token.value.substring(1).trim(); 
        }
        return token;
      });
  
      this.tokens = this.tokens.map(token => {
        if (token.type === 'nested-blockquote') {
            token.value = token.value.substring(2).trim(); 
        }
        return token;
      });
  
      while (this.index < this.tokens.length) {
        const token = this.tokens[this.index];
  
        if (token.type === 'header'){
          this.parseHeader();
  
        } else if (token.type === 'blockquote') {
          this.parseBlockquote();
  
        } else if (token.type === 'ordered') {
          this.parseOrderedList();
  
        } else if (token.type === 'unordered') {
          this.parseUnorderedList();
  
        } else if (token.type === 'paragraph') {
          this.parseParagraph();
        
        } else if (token.type === 'table') {
          this.parseTable();
        
        } else if (token.type === 'indentedCodeblock') {
          this.parseIndentedCodeblock();
  
        } else if (token.type === 'fencedCodeblock') {
          this.parseFencedCodeblock();
  
        } else if (token.type === 'tasklist') {
          this.parseTasklist();
  
        } else if (token.type === 'horizontal-rule') {
          this.parseHorizontalRule();
        }
      }
      return this.ast;
    }
  
    parseHeader() {
      const headerToken = this.tokens[this.index];
      const level = headerToken.value.match(/^#+/)[0].length; // Extract the number of '#' characters to determine the heading level
      const headerValue = headerToken.value.replace(/^#+\s*/, ''); // Remove the '#' characters and whitespaces
  
      let customID = '';
      customID = headerValue.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
      customID = this.generateUniqueID(customID);
  
      const headerNode = { type: 'header', level: level, value: headerValue, id: customID };
      this.ast.children.push(headerNode);
      this.index++;
    }
  
    generateUniqueID(baseID) {
      let uniqueID = baseID;
      let counter = 1;
  
      while (this.customIDs.has(uniqueID)) {
        uniqueID = `${baseID}-${counter}`;
        counter++;
      }
  
      this.customIDs.add(uniqueID);
      return uniqueID;
    }
  
    parseParagraph() {
      const paragraphNode = { type: 'paragraph', children: [] };
      const token = this.tokens[this.index];
      const inlineTokens = this.constructor.parseInlineElements(token.value);
      paragraphNode.children.push(...inlineTokens);
      this.ast.children.push(paragraphNode);
      this.index++;
    }
  
    parseBlockquote() {
      const blockquoteNode = { type: 'blockquote', children: [] };
  
      while (this.index < this.tokens.length && this.tokens[this.index].type === 'blockquote') {
        let currentBlockquote = '';
      
        while (this.index < this.tokens.length && this.tokens[this.index].type === 'blockquote') {
          const token = this.tokens[this.index];
          const nextToken = this.tokens[this.index+1];
          const blockquoteValue = token.value.trim();
  
          // Detect list
          if (this.isListStart(blockquoteValue)) { 
              
            const nestedWithoutWS = blockquoteValue.replace(/\$WS\$/g, '');
  
            if (this.isUnorderedListItem(nestedWithoutWS)) {
                this.parseBQunorderedList(blockquoteNode);
            } else {
                this.parseBQorderedList(blockquoteNode);
            }
  
            continue;
          }
   
          // Check if it's a header
          if (blockquoteValue.startsWith('#')) {
              // Extract header level
              let headerLevel = 0;
              while (headerLevel < blockquoteValue.length && blockquoteValue[headerLevel] === '#') {
                  headerLevel++;
              }
              const headerValue = blockquoteValue.substring(headerLevel).trim();
  
              let customID = '';
              customID = headerValue.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
              customID = this.generateUniqueID(customID);
  
              blockquoteNode.children.push({ type: 'header', level: headerLevel, value: headerValue, id: customID });
          
          } else {
  
              if (nextToken && nextToken.type === 'blockquote' && nextToken.value.substring(1).trim() !== '') { 
                currentBlockquote += ' ' + blockquoteValue;
              }
  
              else {
                currentBlockquote += ' ' + blockquoteValue;
  
                if (currentBlockquote) {
                  
                  // Parse the content as a paragraph
                  const inlineTokens = this.constructor.parseInlineElements(currentBlockquote.trim());
                  blockquoteNode.children.push({ type: 'paragraph', children: inlineTokens });
  
                }
  
                currentBlockquote = ''; // reset current blockquote
  
              }
          }
  
          this.index++;
        }
  
        // Parse nested blockquotes
        while (this.index < this.tokens.length && this.tokens[this.index].type === 'nested-blockquote') {
          const nestedBlockquoteNode = this.parseNestedBlockquote();
          blockquoteNode.children.push(nestedBlockquoteNode);
        }
  
      }
  
      // Push the blockquoteNode to the AST
      this.ast.children.push(blockquoteNode);
    }
  
    parseNestedBlockquote() {
      const nestedBlockquoteNode = { type: 'blockquote', children: [] };
  
      while (this.index < this.tokens.length && this.tokens[this.index].type === 'nested-blockquote') {
        let currentNestedBlockquote = '';
        while (this.index < this.tokens.length && this.tokens[this.index].type === 'nested-blockquote') {
          const token = this.tokens[this.index];
          const nestedBlockquoteValue = token.value.trim();
          const nextToken = this.tokens[this.index+1];
  
  
          // Detect list
          if (this.isListStart(nestedBlockquoteValue)) { 
              
            const nestedWithoutWS = nestedBlockquoteValue.replace(/\$WS\$/g, '');
  
            if (this.isUnorderedListItem(nestedWithoutWS)) {
                this.parseBQunorderedList(nestedBlockquoteNode);
            } else {
                this.parseBQorderedList(nestedBlockquoteNode);
            }
  
            continue;
          }
   
          // Check if it's a header
          if (nestedBlockquoteValue.startsWith('#')) {
              // Extract header level
              let headerLevel = 0;
              while (headerLevel < nestedBlockquoteValue.length && nestedBlockquoteValue[headerLevel] === '#') {
                  headerLevel++;
              }
              const headerValue = nestedBlockquoteValue.substring(headerLevel).trim();
  
              let customID = '';
              
              customID = headerValue.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
              customID = this.generateUniqueID(customID);
  
              nestedBlockquoteNode.children.push({ type: 'header', level: headerLevel, value: headerValue, id: customID });
          
          } else {
  
            if (nextToken && nextToken.type === 'nested-blockquote' && nextToken.value.substring(2).trim() !== '') { 
              currentNestedBlockquote += ' ' + nestedBlockquoteValue;
            }
  
            else {
              currentNestedBlockquote += ' ' + nestedBlockquoteValue;
  
              // Push the current nested blockquote content as a paragraph
              if (currentNestedBlockquote) {
  
                // Parse the content as a paragraph
                const inlineTokens = this.constructor.parseInlineElements(currentNestedBlockquote.trim());
                nestedBlockquoteNode.children.push({ type: 'paragraph', children: inlineTokens });
  
              }
  
              currentNestedBlockquote = ''; // reset current blockquote
  
            }
          }
  
          this.index++;
        }
  
      }
  
      return nestedBlockquoteNode;
    }
  
    isListStart(value) {
      return value.startsWith('-') || value.startsWith('*') || value.startsWith('+') || value.includes('$WS$') || this.isOrderedListItem(value);
    }
  
    parseBQorderedList(blockquoteNode) {
      const listNode = { type: 'ordered-list', children: [] };    
      while (this.index < this.tokens.length && this.isOrderedListItem(this.tokens[this.index].value)) {
        const nestedLevel = this.countWhitespace(this.tokens[this.index].value);
        this.parseListItem(listNode, 'ordered', nestedLevel);
      }
      blockquoteNode.children.push(listNode);
    }
  
    parseBQunorderedList(blockquoteNode) {
      const listNode = { type: 'unordered-list', children: [] };
      while (this.index < this.tokens.length && this.isUnorderedListItem(this.tokens[this.index].value)) {
        const nestedLevel = this.countWhitespace(this.tokens[this.index].value);
        this.parseListItem(listNode, 'unordered', nestedLevel);
      }
      blockquoteNode.children.push(listNode);
    }
  
    parseOrderedList() {
      const listNode = { type: 'ordered-list', children: [] };
      
      while (this.index < this.tokens.length && this.isOrderedListItem(this.tokens[this.index].value)) {
        const nestedLevel = this.countWhitespace(this.tokens[this.index].value);
        this.parseListItem(listNode, 'ordered', nestedLevel);
      }
      this.ast.children.push(listNode);
    }
  
    parseUnorderedList() {
      const listNode = { type: 'unordered-list', children: [] };
      while (this.index < this.tokens.length && this.isUnorderedListItem(this.tokens[this.index].value)) {
        const nestedLevel = this.countWhitespace(this.tokens[this.index].value);
        this.parseListItem(listNode, 'unordered', nestedLevel);
      }
      this.ast.children.push(listNode);
    }
  
    isUnorderedListItem(tokenValue) {
      return tokenValue.startsWith('-') || tokenValue.startsWith('*') || tokenValue.startsWith('+') || tokenValue.includes('$WS$');
    }
  
    isOrderedListItem(tokenValue) {
      return /^\d+\./.test(tokenValue.trim()) || tokenValue.includes('$WS$');
    }
  
    parseListItem(parentNode, type, nestedLevel) {
      const listItemNode = { type: 'list-item', children: [] };
      const token = this.tokens[this.index];
  
      if (type === 'ordered') {
        listItemNode.value = token.value.substring(token.value.indexOf('.') + 1).trim();
      } else if (type === 'unordered') {
        listItemNode.value = token.value.substring(token.value.indexOf('-') + 1 || token.value.indexOf('*') + 1 || token.value.indexOf('*') + 1).trim();
      }
      this.index++;
  
      const inlineTokens = this.constructor.parseInlineElements(listItemNode.value);
      listItemNode.children.push(...inlineTokens);
    
      parentNode.children.push(listItemNode);
  
      let currentListNode = null;
  
      // Check if there are nested lists and parse them recursively
      while (this.index < this.tokens.length) {
        
        const nextToken = this.tokens[this.index];
        
        const nextNestedLevel = this.countWhitespace(nextToken.value); // nested number of whitespace symbol
        const nestedWithoutWS = nextToken.value.replace(/\$WS\$/g, ''); // without the whitespace symbol
  
        const nextType = nestedWithoutWS.trim().startsWith('-') || nestedWithoutWS.trim().startsWith('*') || nestedWithoutWS.trim().startsWith('+') ? 'unordered' : 'ordered';
        
        if (nextNestedLevel > nestedLevel) { // there is a nested list
            if (!currentListNode || currentListNode.type !== nextType + '-list') {
              currentListNode = { type: nextType === 'ordered' ? 'ordered-list' : 'unordered-list', children: [] };
              listItemNode.children.push(currentListNode);
            }
            this.parseListItem(currentListNode, nextType, nextNestedLevel);
        } else {
            break;
        }
      }
  
    }
    
    countWhitespace(line) {
      const match = line.match(/\$WS\$/g);
      return match ? match.length : 0;
    }
  
    parseHorizontalRule() {
      const hrNode = { type: 'horizontal-rule', value: this.tokens[this.index].value.substring(3).trim()};
      this.ast.children.push(hrNode);
      this.index++;
    }
  
    parseTable() {
      const tableNode = { type: 'table', head: [], rows: [] };
      let isHead = true;
  
      const rows = this.tokens[this.index].value.split('\n');
  
      // Parse each row of the table
      rows.forEach(rowValue => {
        const rowNode = { type: 'table-row', cells: [] };
  
        const cellValues = rowValue.split('|').map(value => value.trim());
        const filteredCellValues = cellValues.filter(value => value !== ''); // remove empty value
        
        // Parse each cell value
        filteredCellValues.forEach(cellValue => {
            const cellNode = { type: 'table-cell', content: [] };
            const inlineTokens = this.constructor.parseInlineElements(cellValue);
            cellNode.content.push(...inlineTokens);
            rowNode.cells.push(cellNode);
        });
  
        if (isHead) { // if first row
            tableNode.head = rowNode.cells;
            isHead = false;
        } else {
            tableNode.rows.push(rowNode);
        }
  
      });
  
      this.ast.children.push(tableNode);
      this.index++;
    }
  
    parseIndentedCodeblock() {
      const codeblockNode = { type: 'codeblock', value: '' };
  
      while (this.index < this.tokens.length && this.tokens[this.index].type === 'indentedCodeblock') {
          codeblockNode.value += this.tokens[this.index].value + '\n'; // Add each line of the code block
          if (this.tokens[this.index + 1].type === 'indentedCodeblock') {
            this.index++;
          } else {
            break;
          }
      }
  
      this.ast.children.push(codeblockNode);
      this.index++;
      
    }
  
    parseFencedCodeblock() {
      const fencedCodeblockNode = { type: 'codeblock', value: '' };
  
      while (this.index < this.tokens.length && this.tokens[this.index].type === 'fencedCodeblock') {
          fencedCodeblockNode.value += this.tokens[this.index].value; // Add each line of the code block
          if (this.tokens[this.index + 1].type === 'fencedCodeblock') {
            this.index++;
          } else {
            break;
          }
      }
  
      this.ast.children.push(fencedCodeblockNode);
      this.index++;
    }
  
    parseTasklist() {
      const tasklistNode = { type: 'tasklist', children: [] };
      let currentTasklist = [];
      let currentIndex = this.index;
  
      while (currentIndex < this.tokens.length && this.tokens[currentIndex].type === 'tasklist') {
          const tasklistToken = this.tokens[currentIndex];
          currentTasklist.push(tasklistToken);
          currentIndex++;
      }
  
      currentTasklist.forEach(tasklistToken => {
          let checkboxState = '';
          if (tasklistToken.checked) {
            checkboxState = 'checked';
          }
  
          const listItemNode = { type: 'tasklist-item', state: checkboxState, content: tasklistToken.value };
          tasklistNode.children.push(listItemNode);
      });
  
      this.ast.children.push(tasklistNode);
      this.index = currentIndex;
    }
  
    static parseInlineElements(text) {
      let startIndex = 0;
      const tokens = [];
  
      while (startIndex < text.length) {
          const startBoldItalic = text.indexOf('***', startIndex);
          const startIndexBold = text.indexOf('**', startIndex);
          const startIndexItalic = text.indexOf('*', startIndex);
          const startCode = text.indexOf('`', startIndex);
          const startURL = text.indexOf('<', startIndex);
          const startLink = text.indexOf('[', startIndex);
          const startImage = text.indexOf('![', startIndex);
          const startLinkedImage = text.indexOf('[![', startIndex);
          const startLineBreak = text.indexOf('$BR$', startIndex);
          const startStrikethrough = text.indexOf('~~', startIndex);
          const startHighlight = text.indexOf('==', startIndex);
          const startSubscript = text.indexOf('~', startIndex);
          const startSuperscript = text.indexOf('^', startIndex);
  
          // Check for the closest special character occurrence
          const nearest = Math.min(
              ...[startLinkedImage, startLink, startLineBreak, startBoldItalic, startIndexBold, startIndexItalic, 
                  startCode, startURL, startStrikethrough, startImage, startHighlight, startSubscript, startSuperscript]
                  .filter(index => index !== -1)
          );
  
          if (nearest === -1) {
              const remainingText = text.substring(startIndex);
              tokens.push({ type: 'text', value: remainingText });
              break;
          }
  
          if (startIndex < nearest) {
              const precedingText = text.substring(startIndex, nearest);
              tokens.push({ type: 'text', value: precedingText });
              startIndex = nearest;
          }
  
          if (startImage === nearest) {
              const endImageAlt = text.indexOf(']', startImage + 2);
              const endImageUrl = text.indexOf(')', endImageAlt + 1);
  
              if (endImageAlt !== -1 && endImageUrl !== -1) {
                  const altText = text.substring(startImage + 2, endImageAlt);
                  const imageParams = text.substring(endImageAlt + 1, endImageUrl).split('"');
                  const url = imageParams[0].trim().slice(1);
                  const title = imageParams[1] ? imageParams[1].trim() : '';
  
                  tokens.push({ type: 'image', alt: altText, url: url, title: title });
                  startIndex = endImageUrl + 1;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startLinkedImage === nearest) {
              const endLink = text.indexOf(')]', nearest);
              const endImageAlt = text.indexOf(']', nearest + 3);
              const endImageUrl = text.indexOf(')', endImageAlt + 1);
              const endURL = text.indexOf(')', endLink + 1);
  
              if (endLink !== -1 && endImageAlt !== -1 && endImageUrl !== -1) {
                  const linkUrlStart = text.indexOf('](', endImageUrl) + 2;
                  const linkUrl = text.substring(linkUrlStart, endURL);
                  const altText = text.substring(nearest + 3, endImageAlt);
                  const imageParams = text.substring(endImageAlt + 2, endImageUrl).split('"');
                  const imgUrl = imageParams[0].trim();
                  const imgTitle = imageParams.length > 1 ? imageParams[1].trim() : '';
  
                  tokens.push({
                      type: 'linkedImage',
                      url: linkUrl,
                      imgUrl: imgUrl,
                      altText: altText,
                      imgTitle: imgTitle
                  });
  
                  startIndex = endURL + 1;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startLink === nearest) {
              const endLinkText = text.indexOf(']', startLink + 1);
              const endLinkUrl = text.indexOf(')', endLinkText + 1);
  
              if (endLinkText !== -1 && endLinkUrl !== -1) {
                  const linkText = text.substring(startLink + 1, endLinkText);
                  const linkParams = text.substring(endLinkText + 1, endLinkUrl).split('"');
                  const url = linkParams[0].trim().slice(1);
                  const title = linkParams[1] ? linkParams[1].trim() : '';
  
                  tokens.push({ type: 'link', text: linkText, url: url, title: title });
                  startIndex = endLinkUrl + 1;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startCode === nearest) {
              const endCode = text.indexOf('`', startCode + 1);
  
              if (endCode !== -1) {
                  const code = text.substring(startCode + 1, endCode);
                  tokens.push({ type: 'code', value: code });
                  startIndex = endCode + 1;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startBoldItalic === nearest) {
              const endBoldItalic = text.indexOf('***', startBoldItalic + 3);
  
              if (endBoldItalic !== -1) {
                  const boldItalicText = text.substring(startBoldItalic + 3, endBoldItalic);
                  const formattedText = this.formattingLinks(boldItalicText);
                  tokens.push({ type: 'boldItalic', value: formattedText });
                  startIndex = endBoldItalic + 3;
                  
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startIndexBold === nearest) {
              const endIndexBold = text.indexOf('**', startIndexBold + 2);
  
              if (endIndexBold !== -1) {
                  const boldText = text.substring(startIndexBold + 2, endIndexBold);
                  const formattedText = this.formattingLinks(boldText);
                  tokens.push({ type: 'bold', value: formattedText });
                  startIndex = endIndexBold + 2;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startIndexItalic === nearest) {
              const endIndexItalic = text.indexOf('*', startIndexItalic + 1);
  
              if (endIndexItalic !== -1) {
                  const italicText = text.substring(startIndexItalic + 1, endIndexItalic);
                  const formattedText = this.formattingLinks(italicText);
                  tokens.push({ type: 'italic', value: formattedText });
                  startIndex = endIndexItalic + 1;
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startStrikethrough === nearest) {
            
              const endStrikethrough = text.indexOf('~~', startStrikethrough + 2);
  
              if (endStrikethrough !== -1) {
                  const strikethroughText = text.substring(startStrikethrough + 2, endStrikethrough);
                  tokens.push({ type: 'strikethrough', value: strikethroughText });
                  startIndex = endStrikethrough + 2;
  
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
              
          } else if (startURL === nearest) {
              const endURL = text.indexOf('>', startURL + 1);
  
              if (endURL !== -1) {
                  const url = text.substring(startURL + 1, endURL);
  
                  if (url === 'br' || url === 'hr') {
                    tokens.push({ type: 'text', value: text });
                    startIndex = nearest + 4; 
                  } else {
                    tokens.push({ type: 'url', value: url });
                    startIndex = endURL + 1;
                  }
  
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
          } else if (startLineBreak === nearest) {
              tokens.push({ type: 'linebreak' });
              startIndex = nearest + 5; 
  
          } else if (startHighlight === nearest) {
              
              const endHighlight = text.indexOf('==', startHighlight + 2);
  
              if (endHighlight !== -1) {
                  const highlightText = text.substring(startHighlight + 2, endHighlight);
                  tokens.push({ type: 'highlight', value: highlightText });
                  startIndex = endHighlight + 2;
  
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
          } else if (startSubscript === nearest) {
              
              const endSubscript = text.indexOf('~', startSubscript + 1);
  
              if (endSubscript !== -1) {
                  const sub = text.substring(startSubscript + 1, endSubscript);
                  tokens.push({ type: 'subscript', value: sub });
                  startIndex = endSubscript + 1;
  
              } else {
                  const remainingText = text.substring(startIndex);
                  tokens.push({ type: 'text', value: remainingText });
                  break;
              }
  
            } else if (startSuperscript === nearest) {
              
                const endSuperscript = text.indexOf('^', startSuperscript + 1);
  
                if (endSuperscript !== -1) {
                    const sup = text.substring(startSuperscript + 1, endSuperscript);
                    tokens.push({ type: 'superscript', value: sup });
                    startIndex = endSuperscript + 1;
  
                } else {
                    const remainingText = text.substring(startIndex);
                    tokens.push({ type: 'text', value: remainingText });
                    break;
                }
            }
  
      } 
  
      // always make sure nasa labas to ng while loop kaloka
      return tokens.filter(token => token.type !== 'text' || token.value.trim() !== '');
      
    }
    
    static formattingLinks(text) {
      let startIndex = 0;
      let html = '';
  
      while (startIndex < text.length) {
          const startLink = text.indexOf('[', startIndex);
  
          if (startLink === -1) {
              html += text.substring(startIndex);
              break;
          }
  
          if (startIndex < startLink) {
              html += text.substring(startIndex, startLink);
              startIndex = startLink;
          }
  
          const endLinkText = text.indexOf(']', startLink + 1);
          const endLinkUrl = text.indexOf(')', endLinkText + 1);
  
          if (endLinkText !== -1 && endLinkUrl !== -1) {
              const linkText = text.substring(startLink + 1, endLinkText);
              const linkParams = text.substring(endLinkText + 1, endLinkUrl).split('"');
              const url = linkParams[0].trim().slice(1);
              const title = linkParams[1] ? linkParams[1].trim() : '';
  
              html += `<a href="${url}"${title ? ` title="${title}"` : ''}>${linkText}</a>`;
              startIndex = endLinkUrl + 1;
          } else {
              html += text.substring(startIndex);
              break;
          }
      }
  
      return html;
    }
  
  }
  
  export default Parser;
  