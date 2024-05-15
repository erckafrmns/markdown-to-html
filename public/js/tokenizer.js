/**TOKENIZER */

class Tokenizer {
    static tokenize(input) {

      const lines = input.split('\n');
      const tokens = [];
      let currentParagraph = '';
      let insideTable = false;
      let tableBuffer = [];
      let currentCodeBlock = null;
      let insideFencedCodeBlock = false;
      let fencedCodeBlockContent = '';
      /** 1 whitespace = $WS$ */
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const nextLine = lines[i + 1]; // Get the next line

        /**HEADER */
        if (trimmedLine.startsWith('#')){
          tokens.push({ type: 'header', value: trimmedLine });

        /**BLOCKQUOTE - NESTED*/
        } else if (line.startsWith('>>')) {
          const markerIndex = line.indexOf('>>');

          const restOfLine = line.slice(markerIndex + 2).trim();
          const UntrimmedLine = line.slice(markerIndex + 3);

          if (restOfLine.startsWith('- ') || restOfLine.startsWith('* ') || restOfLine.startsWith('+ ') || /^\d+\./.test(restOfLine)) {

            if (/^\d+\./.test(restOfLine)) { // ordered list
              const listMarkerIndex = UntrimmedLine.indexOf(restOfLine.match(/^\d+\./)[0]);
              
              if (listMarkerIndex > 0 && /\s/.test(UntrimmedLine.charAt(listMarkerIndex - 1))) {
                let whitespaceCount = 0;
                let modifiedLine = '';
                let newValue = '';
    
                for (let i = 0; i < listMarkerIndex; i++) {
                  if (/\s/.test(UntrimmedLine.charAt(i))) {
                    modifiedLine += '$WS$';
                    whitespaceCount++;
                  } else {
                    modifiedLine += UntrimmedLine.charAt(i);
                  }
                }

                // Append the rest of the line starting from the list marker
                modifiedLine += restOfLine;
                modifiedLine = '>> ' + modifiedLine;
                newValue = modifiedLine.trim();
    
                tokens.push({ type: 'nested-blockquote', value: newValue });
              } else {
                tokens.push({ type: 'nested-blockquote', value: trimmedLine });
              }
            
            } else { // unordered list

              const listMarkerIndex = UntrimmedLine.indexOf(restOfLine.charAt(0));

              if (listMarkerIndex > 0 && /\s/.test(UntrimmedLine.charAt(listMarkerIndex - 1))) {
                let whitespaceCount = 0;
                let modifiedLine = '';
                let newValue = '';

                for (let i = 0; i < listMarkerIndex; i++) {
                  if (/\s/.test(UntrimmedLine.charAt(i))) {
                    modifiedLine += '$WS$';
                    whitespaceCount++;
                  } else {
                    modifiedLine += UntrimmedLine.charAt(i);
                  }
                }

                // Append the rest of the line starting from the list marker
                modifiedLine += restOfLine;
                modifiedLine = '>> ' + modifiedLine;
                newValue = modifiedLine.trim();

                tokens.push({ type: 'nested-blockquote', value: newValue });

              } else {
                tokens.push({ type: 'nested-blockquote', value: trimmedLine });
              }

            }

          } else {
            tokens.push({ type: 'nested-blockquote', value: line });
          }

        /**BLOCKQUOTE - REGULAR*/
        } else if (trimmedLine.startsWith('>')){
          const markerIndex = line.indexOf('>');

          // Check for lists within blockquotes
          const restOfLine = line.slice(markerIndex + 1).trim();
          const UntrimmedLine = line.slice(markerIndex + 2);

          if (restOfLine.startsWith('- ') || restOfLine.startsWith('* ') || restOfLine.startsWith('+ ') || /^\d+\./.test(restOfLine)) {
            
            if (/^\d+\./.test(restOfLine)) { // ordered list
              const listMarkerIndex = UntrimmedLine.indexOf(restOfLine.match(/^\d+\./)[0]);
              
              if (listMarkerIndex > 0 && /\s/.test(UntrimmedLine.charAt(listMarkerIndex - 1))) {
                let whitespaceCount = 0;
                let modifiedLine = '';
                let newValue = '';
    
                for (let i = 0; i < listMarkerIndex; i++) {
                  if (/\s/.test(UntrimmedLine.charAt(i))) {
                    modifiedLine += '$WS$';
                    whitespaceCount++;
                  } else {
                    modifiedLine += UntrimmedLine.charAt(i);
                  }
                }

                // Append the rest of the line starting from the list marker
                modifiedLine += restOfLine;
                modifiedLine = '> ' + modifiedLine;
                newValue = modifiedLine.trim();
    
                tokens.push({ type: 'blockquote', value: newValue });
              } else {
                tokens.push({ type: 'blockquote', value: trimmedLine });
              }
            
            } else { // unordered list

              const listMarkerIndex = UntrimmedLine.indexOf(restOfLine.charAt(0));

              if (listMarkerIndex > 0 && /\s/.test(UntrimmedLine.charAt(listMarkerIndex - 1))) {
                let whitespaceCount = 0;
                let modifiedLine = '';
                let newValue = '';

                for (let i = 0; i < listMarkerIndex; i++) {
                  if (/\s/.test(UntrimmedLine.charAt(i))) {
                    modifiedLine += '$WS$';
                    whitespaceCount++;
                  } else {
                    modifiedLine += UntrimmedLine.charAt(i);
                  }
                }

                // Append the rest of the line starting from the list marker
                modifiedLine += restOfLine;
                modifiedLine = '> ' + modifiedLine;
                newValue = modifiedLine.trim();

                tokens.push({ type: 'blockquote', value: newValue });

              } else {
                tokens.push({ type: 'blockquote', value: trimmedLine });
              }

            }

          } else {

            tokens.push({ type: 'blockquote', value: trimmedLine });
          }

        /**TASK LISTS */
        } else if (line.startsWith('- [') && line.includes(']')) {

          const isChecked = line.includes('[x]');
          const taskContent = line.slice(line.indexOf(']') + 2).trim();

          tokens.push({ type: 'tasklist', value: taskContent, checked: isChecked });
        
        /**HORIZONTAL RULE */
        } else if (trimmedLine.startsWith('---')) {
          tokens.push({ type: 'horizontal-rule', value: trimmedLine });
        
        /**UNORDERED LISTS */
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('+ ')) {

          const markerIndex = line.indexOf(trimmedLine.charAt(0));
          if (markerIndex > 0 && /\s/.test(line.charAt(markerIndex - 1))) {
            let whitespaceCount = 0;
            let modifiedLine = '';
            let newValue = '';

            for (let i = 0; i < markerIndex; i++) {
              if (/\s/.test(line.charAt(i))) {
                modifiedLine += '$WS$';
                whitespaceCount++;
              } else {
                modifiedLine += line.charAt(i);
              }
            }

            // Append the rest of the line starting from the list marker
            modifiedLine += line.slice(markerIndex);
            newValue = modifiedLine.trim();

            tokens.push({ type: 'unordered', value: newValue });

          } else {
            tokens.push({ type: 'unordered', value: trimmedLine });
          }
          
        /**ORDERED LISTS */
        } else if (/^\d+\./.test(trimmedLine)) {
          
          const markerIndex = line.indexOf(trimmedLine.match(/^\d+\./)[0]);

          if (markerIndex > 0 && /\s/.test(line.charAt(markerIndex - 1))) {
            let whitespaceCount = 0;
            let modifiedLine = '';
            let newValue = '';

            for (let i = 0; i < markerIndex; i++) {
              if (/\s/.test(line.charAt(i))) {
                modifiedLine += '$WS$';
                whitespaceCount++;
              } else {
                modifiedLine += line.charAt(i);
              }
            }

            // Append the rest of the line starting from the list marker
            modifiedLine += line.slice(markerIndex);
            newValue = modifiedLine.trim();

            tokens.push({ type: 'ordered', value: newValue });
          } else {
            tokens.push({ type: 'ordered', value: trimmedLine });
          }

        /**TABLE */
        } else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            
          if (insideTable) {
                tableBuffer.push(trimmedLine);
            
              } else if (nextLine.startsWith('|') && nextLine.includes('-')) {
                insideTable = true;
                tableBuffer.push(trimmedLine);
                i++; // Skip the next line as it's part of the table header
            }

        /**END OF TABLE */
        } else if (insideTable) {
          tokens.push({ type: 'table', value: tableBuffer.join('\n') });
          insideTable = false;
          tableBuffer = [];
          i--; // Re-process the current line as it's not part of the table
        
        /**CODEBLOCKS */
        } else if (line.startsWith('    ')) { //four whitespace or indent
          
          if (!currentCodeBlock) {
            currentCodeBlock = [];
          }
          currentCodeBlock.push(line.substring(4)); // Remove leading spaces
        
        } else if (!line.startsWith('    ') && currentCodeBlock) {
          
          if (currentCodeBlock) {
            tokens.push({ type: 'indentedCodeblock', value: currentCodeBlock.join('\n') });
            currentCodeBlock = null;
          }
        
        /**FENCED CODEBLOCKS */
        } else if (trimmedLine === '```' || trimmedLine === '~~~') {

          if (insideFencedCodeBlock) {
            tokens.push({ type: 'fencedCodeblock', value: fencedCodeBlockContent });
            insideFencedCodeBlock = false;
            fencedCodeBlockContent = '';
          } else {
              insideFencedCodeBlock = true;
          }

        } else if (insideFencedCodeBlock) {
          fencedCodeBlockContent += line + '\n';
        
        /**PARAGRAPH */
        } else if (trimmedLine.length > 0) {

          if (nextLine && nextLine.trim() !== '') { // If next line is not empty and is part of the current statement
            
            const hasLineBreak = /\s{2,}$/.test(line); // Check for 2 or more trailing whitespace

            if (hasLineBreak) {
              currentParagraph = line.replace(/\s+$/, ' $BR$'); //temporary linebreak
              currentParagraph = ' ' + currentParagraph.trim();

            } else {
              currentParagraph += ' ' + line.trim(); // Append line to current statement
            }
        
          } else {
              const hasLineBreak = /\s{2,}$/.test(line); // Check for 2 or more trailing whitespace
              
              if (hasLineBreak) {
                currentParagraph = line.replace(/\s+$/, ' $BR$'); //temporary linebreak
                currentParagraph = ' ' + currentParagraph.trim();

              } else {
                currentParagraph += ' ' + line.trim(); // Append line to current statement
              }
              
              if (currentParagraph !== '') {

                tokens.push({ type: 'paragraph', value: currentParagraph.trim()});
                currentParagraph = ''; // Reset current statement

              }
          }

        }

      }  

      // Handle case where input ends with a paragraph
      if (currentParagraph.length > 0) {
        tokens.push({ type: 'paragraph', value: currentParagraph.trim() });
      }

      // Handle case where input ends with a table
      if (insideTable) {
          tokens.push({ type: 'table', value: tableBuffer.join('\n') });
          insideTable = false;
      }

      return tokens;

    }
    
  }
  
  module.exports = Tokenizer;
  