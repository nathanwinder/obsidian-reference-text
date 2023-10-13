import { ExternalTokenizer } from "@lezer/lr";
import { Symbol, Text } from "./parser.terms.js";

const eof = -1;
const escape = '\\'.charCodeAt(0);
const paren = ')'.charCodeAt(0);
const cr = '\r'.charCodeAt(0)
const nl = '\n'.charCodeAt(0)
const underscore = 95;

function isAlpha(ch) { return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122}

function isDigit(ch) { return ch >= 48 && ch <= 57 }

function isSymbol(ch){ return isAlpha(ch) || isDigit(ch) || ch === underscore }

function isTerminal(ch, input) { return ch === eof || ((ch === paren || ch === nl || ch === cr ) && (input.peek(-1) !== escape))}

function debug(input, stack){ 
    const stackChar = input.peek(stack.pos - input.pos);
    return `stack:${stack.pos}<${stackChar}:${String.fromCharCode(stackChar)}> input:${input.pos}<${input.next}:${String.fromCharCode(input.next)}>` 
}

export const aliasTextOrSymbol = new ExternalTokenizer((input, stack)=> {
    console.log("Enter", debug(input, stack));

    let {next} = input;
    let token = Symbol;

    if(isTerminal(next, input))
    {
        console.log("Terminate", debug(input, stack));
        return;
    }

    let read = "";
    do {
        read += String.fromCharCode(next)
        console.log(`Read ${String.fromCharCode(next)}`);
        if(!isSymbol(next)){
            console.log(`Found text from:${String.fromCharCode(next)}`);
            token = Text;
        }
        next = input.advance();
    } while(!isTerminal(next, input))

    console.log( `input.acceptToken(${{ [Symbol]: "Symbol", [Text]: "Text"}[token]}, 1)<${read}>`)
    input.acceptToken(token, 1);

    console.log("Exit", debug(input, stack));
});