<script setup lang="ts">

import { ref } from 'vue';
import type { inputProperties, linkInputs } from '@/types/allTypes';

const emits = defineEmits(['confirmAddLink']);

const inputsData: linkInputs = {
/*     alias: { text: '', inputElement: ref(null), isTextCorrect: ref(true), errorMessageElement: ref(null), validatingFunction: validateAliasText },
 */    url: {  text: '', inputElement: ref(null), isTextCorrect: ref(true),  errorMessageElement: ref(null), validatingFunction: validateURLText }
};

/* function validateAliasText(textToVerify: string): true | string  {
    const textToVerify_Trimmed = textToVerify.trim(); // This variable removes spaces from beginning and end of the string
    if(!(/^[A-Za-z\d\s]+$/.test(textToVerify_Trimmed))) { return `Alias can contain only letters and numbers`};
    if(textToVerify_Trimmed.length <= 2) { return `Alias should contain at least 3 characters`};
    if(textToVerify_Trimmed.length >= 16) { return `Alias can contain no more than 15 characters`};
    return true;
} */

function validateURLText(textToVerify: string): true | string {
    const textToVerify_Trimmed = textToVerify.trim(); // This variable removes spaces from beginning and end of the string
    if(!textToVerify_Trimmed.length) { return `A URL address cannot be empty` };
    if(!(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/.test(textToVerify_Trimmed))) { return `Please provide a valid URL address` };
    return true;
}

function handleErrorTracing([isValidationOK, validationMessage]: [boolean, string], inputProps: inputProperties): void {
    inputProps.isTextCorrect.value = isValidationOK;
    if(inputProps.errorMessageElement.value) {
        inputProps.errorMessageElement.value.textContent = isValidationOK? '' : validationMessage;
    }
}

const handleAddLink = function() {

    const inputsDataKeys = Object.keys(inputsData);

    const invalidInputFiledsCount = inputsDataKeys.reduce((acc, key: string) => {
        const validationFunctionResult =  inputsData[key as keyof linkInputs].validatingFunction(inputsData[key as keyof linkInputs].text);
        handleErrorTracing((validationFunctionResult === true)? [true, ''] : [false, validationFunctionResult], inputsData[key as keyof linkInputs]);
        return validationFunctionResult === true? acc : acc + 1;
    }, 0)

    // If there is no errors in the form inputs, then proceed with the actual button functionality
    if(invalidInputFiledsCount === 0) {
        // A convenience macro - if user forgets to type https or http at the URL beginning (which is required), the provided URL is automatically
        // being added an https://  clause at the very beginning
        const textToVerify_WithURLPrefix = /^(https?:\/\/)/.test(inputsData['url'].text.trim()) ? inputsData['url'].text.trim() : `https://` + inputsData['url'].text.trim();
        emits('confirmAddLink', textToVerify_WithURLPrefix);
    }

}

</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <h2 class="text-3xl mb-3"> Add a link </h2>

        <form id="addlink" name="addlink" method="post" action="" @submit.prevent="handleAddLink">
<!--             <div class="relative">
                <input :ref="inputsData[`alias`].inputElement" v-model="inputsData[`alias`].text" type="text" placeholder="Link Alias Name..." class="min-w-64 text-center text-sm px-4 py-3 my-4 block shadow-[0.1rem_0.1rem_0.3rem_#222] border-2" 
                    :class="!inputsData[`alias`].isTextCorrect.value && `border-red-500`"
                />
                <span :ref="inputsData[`alias`].errorMessageElement" class="absolute text-center text-[0.66rem] text-red-500 font-semibold bottom-0 mx-auto w-full block"> </span>
            </div> -->

            <div class="relative">
                <input :ref="inputsData[`url`].inputElement" v-model="inputsData[`url`].text" type="text" placeholder="URL address..." class="min-w-64 text-center text-sm px-4 py-3 my-4 block shadow-[0.1rem_0.1rem_0.3rem_#222] border-2" 
                    :class="!inputsData[`url`].isTextCorrect.value && `border-red-500`"
                />
                <span :ref="inputsData[`url`].errorMessageElement" class="absolute text-center text-[0.66rem] text-red-500 font-semibold bottom-0 mx-auto w-full block"> </span>
            </div>


            <button class="w-full my-4 px-6 py-3 text-center text-[#eee] inline-block rounded-md shadow-md
                bg-[#222a] transition-colors hover:bg-[#222d] hover:cursor-pointer
            "
                type="submit"
            > Confirm </button>
        </form>

    </div>
</template>

<style scoped>

</style>