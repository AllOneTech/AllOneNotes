import type { Ref } from "vue";


const dynamicElements: string[] = ['dialogBox', 'optionsList'] as const;
type availableDialogBoxNames = 'link' | 'image' | 'video';
export type availableOptionsListNames = 'fontsize' | 'fontfamily';
export type allowedElementNamespace = null | availableOptionsListNames | availableDialogBoxNames;


export type elementDetailObj = {
    name: allowedElementNamespace,
    coords: {
        x: number,
        y: number
    },
    optional: {
        /* This parameters are useful for some (not all) of the Elements that uses elementDetailObj type */
        targetWidth: number
    }
}

export type dynamicElementsDetailsObj = {
    [K in typeof dynamicElements[number]]: elementDetailObj
}

export type inputProperties = {
    text: string,
    inputElement: Ref<null | HTMLInputElement>, 
    isTextCorrect: Ref<boolean>, 
    errorMessageElement: Ref<null | HTMLSpanElement>, 
    validatingFunction: any
}

export type fontFamilyOptionsObj = {
    name: string,
    sourceURL: string,
    isAlreadyLoaded: boolean
}

export type linkInputs = {
   /*  alias: inputProperties, */
    url: inputProperties
}

export type imageInputs = {
    url: inputProperties
}