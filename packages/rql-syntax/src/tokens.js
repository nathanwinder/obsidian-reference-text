import { ExternalTokenizer } from "@lezer/lr";
import { Symbol, Text } from "./parser.terms";

const EOF = -1;
const BACKSLASH = 92;
const RIGHT_PAREN = 41;
const CARIAGE_RETURN = '\r'.charCodeAt(0)
const NEWLINE = '\n'.charCodeAt(0)

export const aliasTextOrSymbol = new ExternalTokenizer((input, stack)=> {
    let isText = false;
    const start = input.pos;
    while(true){

        if(input.next === EOF || input.next === CARIAGE_RETURN || input.next === NEWLINE)
            return;

        if(input.next === RIGHT_PAREN && input.peek(-1) !== BACKSLASH)
        {
            const end = input.pos;
            if(isText){
                console.log("Text", [start, end]);
                input.acceptToken(Text, 1);
            } else {
                console.log("Symbol", [start, end]);
                input.acceptToken(Symbol, 1);
            }
            return;
        }

        if(!isText){
            const next = input.next;
            const isNumber = next > 47 && next < 58;
            const isUpperLetter = next > 64 && next < 91;
            const isLowerLetter = next > 96 && next < 123;
            const isUndersocre = next === 95;
            if(!isNumber || !isUpperLetter || !isLowerLetter || !isUndersocre){
                isText = true;
            }
        }
        input.advance(1);
    }
});