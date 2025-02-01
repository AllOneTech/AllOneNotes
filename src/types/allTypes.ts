import type { Ref } from "vue";

export type availableDialogBoxNames = null | 'link';
export type dialogBoxDetailsObj = {
    name: availableDialogBoxNames,
    coords: {
        x: number,
        y: number
    }
}

export type inputProperties = {
    text: string,
    inputElement: Ref<null | HTMLInputElement>, 
    isTextCorrect: Ref<boolean>, 
    errorMessageElement: Ref<null | HTMLSpanElement>, 
    validatingFunction: any
}

export type linkInputs = {
   /*  alias: inputProperties, */
    url: inputProperties
}