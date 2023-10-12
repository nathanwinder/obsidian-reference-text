import {parser} from "./parser.js";

describe("valid rql", ()=> {
    it("single symbol flag", test(`#flag`, e=> e.toMatchSnapshot()))

    it("single text flag", test(`#"flag"`, e=> e.toMatchSnapshot()))

    it("single flag", test(`#flag`, e=> e.toMatchSnapshot()))

    it("source and flag", test(`source #flag`, e=> e.toMatchSnapshot()))

    it("source and symbol tag", test(`source #tag value`, e=> e.toMatchSnapshot()))

    it("source and text tag", test(`source #tag "text value"`, e=> e.toMatchSnapshot()))

    it("symbol span", test(`1-5`, e=> e.toMatchSnapshot()))

    it("text span", test(`"Text 1"-"Text 5"`, e=> e.toMatchSnapshot()))

    it("symbol range", test(`1, 5`, e=> e.toMatchSnapshot()))

    it("text range", test(`"Text 1", "Text 5"`, e=> e.toMatchSnapshot()))

    it("complex range", test(`1-2, 5, "Text 9", "Text 10" - "Text 13"`, e=> e.toMatchSnapshot()))

    it("simple transform", test(`[Highlight red] (HR)`, e=> e.toMatchSnapshot()))

    it("multi-transform", test(`[Highlight red & Underline blue] (Hr Ub)`, e=> e.toMatchSnapshot()))

    it("simple reference", test(`John 3:16`, e=> e.toMatchSnapshot()))

    it("multi-operation reference", test(`John Niv 3:16 & John Esv 3:16 & John Nasb 3:16`, e=> e.toMatchSnapshot()))

    it("reference operation transform", test(`John 3:16 ["God" & Highlight]`, e=> e.toMatchSnapshot()))

    it("reference operation multi-transform", test(`John 3:16 ["God" & Highlight red & Underline blue]`, e=> e.toMatchSnapshot()))

    it("reference multi-operation multi-transform reference-transform", test(`John ESV 3:16 [ "God" & H ] & John NIV 3:16 [ "God" & U ] & [ "God" & bold ]`, e=> e.toMatchSnapshot()))

    it("multi-line document", test(`
    [Highlight red] (hr) [Underline blue] (ub)
    [hr & ub] (hrub)

    [strike] (s)
    Bibles Niv John (John)



    John 3:16-17, 19
    ["God" & hrub & italics]
    ["Son"
    & hrub
    & itaclis]

    James 1:1`, e=> e.toMatchSnapshot()))

});

describe("invalid rql", ()=> {
    it("multiple odd span", test(`1-2-3`, e=> e.toMatchSnapshot()))
    it("multiple even span", test(`1-2-3-4`, e=> e.toMatchSnapshot()))
});

/**
 * 
 * @param {string} expression 
 * @param {} assertion this is done so that test tooling will see "toMatchSnapshot" 
 * call in the test and add the appropriate context menu options to view or update the snapshot. 
 */
function test(expression, assertion){
    return ()=> assertion(expect(render(expression)))
}

/**
 * 
 * @param {string} expression 
 */
function render(expression){
    let tree = parser.parse(expression);
    let output = "";
    let depth = 0;
    tree.iterate({
        enter: (node) => {
            const hasChild = node.node.firstChild != null;
            const value = hasChild? "": `<${expression.substring(node.from, node.to)}>`;
            output += `\n${"·".repeat(depth)}${node.name}${value}`; 
            depth++;
        },
        leave: (node) => {
            depth--;
        }
    });
    return "\n" + expression + "\n----------------------------------------------" + output + "\n";
}
