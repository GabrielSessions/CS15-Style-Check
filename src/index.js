// BG Image From: https://pixabay.com/photos/background-geometric-triangle-3045402/

const SUBMIT_ID = "#submitButton";
const SCAN_LIST = "#scanList";
const SCAN_TITLE = "#scanTitle";
const INPUT_CODE = "#inputCode";


function createListItem(listText) {
    let newItem = document.createElement('li');
    $(newItem).html(listText);
    $(SCAN_LIST).append(newItem);
}

function disableButton() {
    $(SUBMIT_ID).attr('disabled', true)
    $(SUBMIT_ID).addClass('disabled');
    $(SUBMIT_ID).removeClass('bg-blue-400');
    $(SUBMIT_ID).removeClass('border-blue-400');
    $(SUBMIT_ID).removeClass('hover:bg-blue-800');
    $(SUBMIT_ID).addClass(' ');
    $(SUBMIT_ID).html("Processing...");
    
}

function enableButton() {
    $(SUBMIT_ID).attr('disabled', false)
    $(SUBMIT_ID).removeClass('disabled');
    $(SUBMIT_ID).removeClass('border-blue-200');
    $(SUBMIT_ID).removeClass('bg-blue-200');
    $(SUBMIT_ID).addClass('bg-blue-400 border-blue-400 hover:bg-blue-800');
    $(SUBMIT_ID).html("Test My Style Again!");
}

function clearScanPanel() {
    $(SCAN_TITLE).html("Your Results");
    $(SCAN_LIST).html("");

}


function checkStyle() {
    let commentActive = false;
    let bracketCount = 0;
    let linesInsideFuncCount = 0;

    let arrOfLines = $(INPUT_CODE).val().split('\n');
    for (let i = 0; i < arrOfLines.length; i++) {
        let currentLine = arrOfLines[i];

        //Checks if in comment mode or not and adjusts mode accordingly
        if (currentLine.indexOf("/*") != -1 && !commentActive) {
            commentActive = true;
        }
        if (currentLine.indexOf("*/") != -1 && commentActive) {
            commentActive = false;
        }


        runChecks(currentLine, i + 1, commentActive);

        if (currentLine.indexOf("{") != -1) {
            bracketCount ++;
            //console.log(bracketCount);
        }
        if (currentLine.indexOf("}") != -1) {
            bracketCount --;
            //console.log(bracketCount);
            if (bracketCount == 0) {
                linesInsideFuncCount = 0;
            }
        }
        if (bracketCount >= 1) {
            thirtyLineRule(linesInsideFuncCount, i+1);
            linesInsideFuncCount ++;
            
        }
        
        


    }

    


    finishedCheck();
}

function runChecks(currentLine, lineNum, commentActive) {
    eightyColRule(currentLine, lineNum);
    findTabChar(currentLine, lineNum);
    
    if (currentLine.substring(0, 2) != "//" && !commentActive) {
        findAuto(currentLine, lineNum);
        checkBinaryOperators(currentLine, lineNum);
        pointerCheck(currentLine, lineNum);
        nullCheck(currentLine, lineNum);
        findBreak(currentLine, lineNum);
        commasCheck(currentLine, lineNum);
        ifForWhileParenthesis(currentLine, lineNum);
    }

}


// All Tests Below

function eightyColRule(line, lineNum) {
    if (line.length > 80) {
        createListItem("Line " + lineNum + " is over 80 columns");
    }
}

function findAuto(line, lineNum) {
    if (line.indexOf("auto ") != -1) {
        createListItem("Warning: Possible use of keyword 'auto' on line " + lineNum);
    }
}

function findTabChar(line, lineNum) {
    if (line.indexOf("\t") != -1) {
        createListItem("Use of tab character on line " + lineNum + ", use spaces instead.");
    }
}

function checkBinaryOperators(line, lineNum) {
    if (line.indexOf("||") != -1) {
        createListItem("Use of || on line " + lineNum + ", use 'or' instead.");
    }
    if (line.indexOf("&&") != -1) {
        createListItem("Use of && on line " + lineNum + ", use 'and' instead");
    }

    let prevExclamationPos = 0;
    while (line.indexOf("!", prevExclamationPos) != -1) {

        let curIndex = line.indexOf("!", prevExclamationPos);

        //Check for common proper use cases of !
        const notEqCheck = (line.substring(curIndex, curIndex + 2) != "!=");
        const charCheck = (line.substring(curIndex-1, curIndex + 2) != "'!'");
        const strCheck1 = (line.substring(curIndex, curIndex + 2) != "!\"");
        const strCheck2 = (line.substring(curIndex-1, curIndex + 1) != "\"!");

        if (notEqCheck && charCheck && strCheck1 && strCheck2) {
            createListItem("Use of ! in non != context on line " + lineNum + ". Replace with 'not' if used as logical not.");
            prevExclamationPos = line.length + 1;
        }

        prevExclamationPos = curIndex + 1;
    }
}

function pointerCheck(line, lineNum) {
    let prevStarPos = 0;
    while (line.indexOf("*", prevStarPos) != -1) {

        let curIndex = line.indexOf("*", prevStarPos);

        //Check for improper use case of *
        const spaceAfter = (line.substring(curIndex + 1, curIndex + 2) == " ");
        const charCheck = (line.substring(curIndex-1, curIndex + 2) != "'*'");
        const strCheck1 = (line.substring(curIndex, curIndex + 2) != "*\"");
        const strCheck2 = (line.substring(curIndex-1, curIndex + 1) != "\"*");
        const multiplicationCheck = 
                            (line.substring(curIndex-1, curIndex+2) != " * ");

        if (spaceAfter && charCheck && strCheck1 && strCheck2 && multiplicationCheck) {
            createListItem("Possible incorrect pointer star (*) placement on line " + lineNum);
            prevExclamationPos = line.length + 1;
        }

        prevStarPos = curIndex + 1;
    }
}

function nullCheck(line, lineNum) {
    if (line.indexOf("NULL") != -1) {
        createListItem("Use of NULL on line " + lineNum + ", use nullptr instead.");
    }
}


function thirtyLineRule(numLines, lineNum) {
    //Only print out alert once per violation
    if (numLines == 31) {
        createListItem("30 line rule violated on line " + lineNum);
    }
}

function findBreak(line, lineNum) {
    if (line.indexOf("break ") != -1) {
        createListItem("Possible use of keyword break on line " + lineNum);
    }
}

function commasCheck(line, lineNum) {
    let prevStarPos = 0;
    while (line.indexOf(",", prevStarPos) != -1) {

        let curIndex = line.indexOf(",", prevStarPos);

        let condition1 = line.substring(curIndex+1, curIndex+2) != " ";
        let condition2 = line.substring(curIndex-1, curIndex+2) != "','";
        let condition3 = line.substring(curIndex-1, curIndex+2) != "\",\"";

        if (condition1 && condition2 && condition3) {
            createListItem("No space after comma on line " + lineNum);
            prevExclamationPos = line.length + 1;
        }

        prevStarPos = curIndex + 1;
    }
}

function ifForWhileParenthesis(line, lineNum) {
    if (line.indexOf("if(") != -1) {
        createListItem("No space between 'if' keyword and parenthesis on " + lineNum);
    }
    if (line.indexOf("for(") != -1) {
        createListItem("No space between 'for' keyword and parenthesis on " + lineNum);
    }
    if (line.indexOf("while(") != -1) {
        createListItem("No space between 'while' keyword and parenthesis on " + lineNum);
    }
}

function finishedCheck() {
    if ($(SCAN_LIST).html() == "") {
        $(SCAN_LIST).html("No style problems found. \n Remember to check your code for proper commenting!");
    }
    enableButton();
}


jQuery(() => {
    console.log("hello world");
    $(SUBMIT_ID).on("click", () => {
        
        disableButton();
        clearScanPanel();
        checkStyle();
        
        
    })
});
