
export type RqlText = string;
export type RqlSymbol = string;
export type RqlSpan = [begin: RqlText, end: RqlText | null];

export interface IRqlSuggestion<T> {
    input: T
    value: T | null 
} 

// my code handles range and others forms of parallelism.

export type RqlInput = RqlText | RqlSpan;

export interface IRqlAncestor {
    step : RqlStep;
}

export interface IRqlContext {
    /**
     * A readonly array of ancestor steps starting with the 
     * current step's parent and ending with the root step.
     */
    readonly ancestors: ReadonlyArray<IRqlAncestor>
}

type RqlStep = 
    & Partial<IRqlValueProvider> 
    & Partial<IRqlBatchValueProvider> 
    & Partial<IRqlTagProvider> 
    & Partial<IRqlBatchTagProvider>

export interface IRqlValueProvider {
    getValueSuggestions<T extends RqlInput>(input: T, context: IRqlContext): Promise<IRqlSuggestion<T>>
    getValue(input: RqlInput | IRqlSuggestion<RqlInput>, context: IRqlContext): Promise<RqlStep>
}

export interface IRqlBatchValueProvider {
    getValueSuggestionsBatch(input: RqlInput[], context: IRqlContext[]): Promise<any[]>
    getValueBatch(input: RqlInput[], context: IRqlContext[]): Promise<RqlStep[]>
}

export interface IRqlTagProvider {
    getTagSuggestions(input: string, context: IRqlContext): Promise<any>
    getTag(input: string, context: IRqlContext): Promise<RqlStep>
}

export interface IRqlBatchTagProvider {
    getTagSuggestionsBatch(input: string[], context: IRqlContext[]): Promise<any[]>
    getTagBatch(input: string[], context: IRqlContext[]): Promise<RqlStep[]>
}

export function isRqlValueProvider(step: RqlStep): step is IRqlValueProvider {
    return typeof(step.getValueSuggestions) === "function" && typeof(step.getValue) === "function";
}

export function isRqlBatchValueProvider(step: RqlStep): step is IRqlBatchValueProvider {
    return typeof(step.getValueSuggestionsBatch) === "function" && typeof(step.getValueBatch) === "function";
}

export function isRqlText(input: RqlInput): input is RqlText {
    return typeof(input) === "string";
}

export function isRqlSpan(input: RqlInput): input is RqlSpan {
    return Array.isArray(input) 
        && input.length === 2 
        && typeof(input[0]) === "string" 
        && ( input[1] === null || typeof(input[1]) === "string"); 
}

export function isRqlSuggestion(value: RqlInput | IRqlSuggestion<RqlInput>): value is IRqlSuggestion<RqlInput> {
    return typeof(value) === "object" 
        && (isRqlText((value as any).input)|| isRqlSpan((value as any).input))
        && ((value as any).value == null || isRqlText((value as any).value)|| isRqlSpan((value as any).value));
}

class AmbiguousStep implements RqlStep {

    constructor(private readonly inner: RqlStep, private readonly conflicts: RqlStep[]) {
    }
    getTagSuggestions(input: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTag(input: string): Promise<RqlStep> {
        throw new Error("Method not implemented.");
    }
    getValueSuggestions(text: RqlInput): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getValue(input: RqlInput): Promise<RqlStep> {
        throw new Error("Method not implemented.");
    }
}

export type PromiseType<T> = T extends Promise<infer U> ? U : never;

type BatchPromiseCallbacks<T> = [resolve: (result: T)=> void, reject: (error: Error)=> void]

class BatchStep implements RqlStep {

    readonly getTag: RqlStep["getTag"]
    readonly getTagSuggestions: RqlStep["getTagSuggestions"]
    readonly getValue: RqlStep["getValue"];
    readonly getValueSuggestions: RqlStep["getValueSuggestions"];

    private readonly getValueCalls: Parameters<Required<RqlStep>["getValue"]>[] = [];
    private readonly getValueCallbacks: Array<BatchPromiseCallbacks<RqlStep>>;
    private readonly getValueSuggestionsCalls: Parameters<Required<RqlStep>["getValueSuggestions"]>[] = [];
    private 

    constructor(private readonly inner: RqlStep) {
        if(isRqlBatchValueProvider(inner))
        {
            this.getValue = this._getValue;
            this.getValueSuggestionsBatch = inner.getValueSuggestionsBatch;
        }
        else if(isRqlValueProvider(inner)){
            this.getValue = inner.getValue;
            this.getValueSuggestions = inner.getValueSuggestions;
        }
    }

    private _getValue(input: RqlInput, context: IRqlContext){
        const index = this.getValueCalls.length;
        this.getValueCalls.push([input, context]);
        setTimeout(this._executeGetValue.bind(this), 0);
        return new Promise<RqlStep>((res, rej)=> {
            this.getValueCallbacks.push([res,rej]);
        }); 
    }

    private async _executeGetValue(){
        if(!this.inner.getValueBatch) return;

        const results = await this.inner.getValueBatch(this.getValueCalls.map(c=>c[0]), this.getValueCalls.map(c=> c[1]));
        this.getValueCallbacks.forEach((cb, i)=> cb[0](results[i]));
    }

}