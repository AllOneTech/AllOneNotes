<script setup lang="ts">
  import Notepad from './components/Notepad.vue';
  import Navbar from './components/Navbar.vue';
  import DialogBox from './components/DialogBox.vue';

  import { ref, computed, reactive, onMounted } from 'vue';
  import type { availableDialogBoxNames, dialogBoxDetailsObj } from './types/allTypes';

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faAngleDown, faAngleUp, faBold, faCloud, faDownload, faFile, faItalic, faLink, faMinus, faPaintBrush, faPencil, faPlus, faStrikethrough, faSubscript, faSuperscript, faT, faUnderline } from '@fortawesome/free-solid-svg-icons';

  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import Highlight from '@tiptap/extension-highlight';
  import Link from '@tiptap/extension-link';
  import Subscript from '@tiptap/extension-subscript';
  import Superscript from '@tiptap/extension-superscript';
  import Color from '@tiptap/extension-color';
  import TextStyle from '@tiptap/extension-text-style';
  import FontSize from 'tiptap-extension-font-size';

  const dialogBoxType = ref<availableDialogBoxNames>(null);
  const linkButton = ref<null | HTMLDivElement>(null);
  const [isTextSelected, selectionText] = [ref<boolean>(false), ref<string>('')];
  const fontSizeInput = { current: ref<number>(16), default: 16,  min: 6,  max: 96, DOMElement: ref()};
  const workspaceEl = ref<null | HTMLElement>(null);

  const currentDialogBoxDetails: dialogBoxDetailsObj = reactive({
    name: null,
    coords: { x: 0, y: 0 }
  });

  const editor = useEditor({
    content: "",
    extensions: [
      FontSize,
      StarterKit, 
      Underline,
      Link, 
      Subscript, 
      Superscript, 
      Color, 
      TextStyle,
      Highlight.configure({
        multicolor: true
      })
    ],
    autofocus: true,
    editable: true,
    editorProps: {
      attributes: {
        class: `focus:outline-none`
      }
    }
  });

  function createDialogBox(dialogBoxName: availableDialogBoxNames, target: EventTarget | null) { 
    if(!target) return;
    if(editor?.value?.isActive('link')) { handleCloseLink(); return; }
    const targetedButton = target as HTMLDivElement;

    console.log(`
      TOP: ${Math.floor(targetedButton.getBoundingClientRect().top)}, \n
      LEFT: ${Math.floor(targetedButton.getBoundingClientRect().left)}, \n
      -------------- \n
      HEIGHT: ${Math.floor(targetedButton.getBoundingClientRect().height)}, \n
      WIDTH: ${Math.floor(targetedButton.getBoundingClientRect().width)}, \n
    `);
    
    Object.assign(currentDialogBoxDetails, {name: dialogBoxName, coords: {y: Math.floor(targetedButton.getBoundingClientRect().top), x: Math.floor(targetedButton.getBoundingClientRect().left)}});
  
    // Last of all - perform a state change and thus cause the Dialog Box to appear
    dialogBoxType.value = dialogBoxName; 
  }

  function handleCloseLink() { 
    editor?.value?.chain().focus().setColor('#000').unsetUnderline().run();
    editor?.value?.commands.unsetLink(); 
  }

  function handleAddLink(urlText: string) {
    editor?.value?.chain().focus().setColor('hsl(208, 70%, 60%)').setUnderline().extendMarkRange('link').setLink({ href: urlText, target: '_blank' }).run()
    handleCloseDialogBox();
  }

  function handleCloseDialogBox() {
    // Close the dialog box already
    dialogBoxType.value = null;
  }
  
  function testSelectedTextOrigin(anchorNode: Node | null) {
    // This function checks if the text selection happens inside or outside the editor workspace 
    if(!anchorNode) return false;
    if(anchorNode.parentElement && anchorNode.parentElement.classList.contains('workspace')) return true;
    return testSelectedTextOrigin(anchorNode.parentElement);
  }

  const testIfTextIsSelected = computed(() => isTextSelected.value);

  const trackButtonBg = computed(() => {
    if(testIfTextIsSelected.value) {
      return editor?.value?.isActive('link')? ` bg-[#222b] hover:cursor-pointer` : ` bg-[#eeeb] hover:cursor-pointer`;
    } else return ` bg-[#7777] hover:cursor-default`;
  })

  onMounted(() => {
    document.addEventListener('selectionchange', () => {
      const selectedText = document.getSelection();
      if(selectedText && selectedText.toString().length > 0) {
        const isSelectedTextComingFromEditor = testSelectedTextOrigin(selectedText.anchorNode);
        isTextSelected.value = isSelectedTextComingFromEditor;
      }
    })

    document.addEventListener('click', (e: MouseEvent) => trackSelectedText(e));
    document.addEventListener('keydown', () => removeSelectedText());

    updateEditorFontSize();
  })

  function removeSelectedText(): void {
    // If any dialog box is open, we do not check for possible removal of Selection on any key down event
    if(dialogBoxType.value !== null) { return; }
    isTextSelected.value = false;
    selectionText.value = '';
  }

  function trackSelectedText(e: MouseEvent) {
    // If any dialog box is open, we do not check for possible removal of Selection on any click
    if(dialogBoxType.value !== null) { return; }
    
    if(e.target instanceof Element) {
      const elementDataRole = e.target.getAttribute('data-role');

      // If we click onto any of the button to style the content, KEEP the text selected state as it is
      if(elementDataRole === 'style') { isTextSelected.value = isTextSelected.value; } 
      
      // Each time selection event is completed, a click event is also being triggered. In case user selects no text, trigger this else if
      else if(!document.getSelection()?.toString()) { isTextSelected.value = false; }
      
      // When text is already selected by a selection event, and then user clicks on the text, the selected text value after click is still
      // the same (but it should be an empty string). This if-else statement solves that issue.
      if(document.getSelection()?.toString() === selectionText.value) { 
        selectionText.value = '';
        isTextSelected.value = false;
      } else { selectionText.value = document.getSelection()?.toString() || ''; }
    }
  }

  function useInputBackgroundColor(event: Event): void {
    const backgroundColorInputElement = event.target as HTMLInputElement;
    if(backgroundColorInputElement && backgroundColorInputElement.value) {
      editor?.value?.chain().focus().toggleHighlight({ color: backgroundColorInputElement.value.length? backgroundColorInputElement.value : `#eeeeee`}).run();
    }
  }

  function useInputColor(event: Event): void {
    const colorInputElement = event.target as HTMLInputElement;
    if(colorInputElement && colorInputElement.value) {
      editor?.value?.chain().focus().setColor(colorInputElement.value.length?  colorInputElement.value : `#222222`).run();
    }
  }

  function convert_RGB_to_HEX(RGB_value: string): string {
    if(RGB_value.includes('#')) return RGB_value;

    const rgbComponents_toNumber = RGB_value.match(/\d+/g)?.map(comp => parseInt(comp));
    if(!rgbComponents_toNumber) return RGB_value;

    return rgbComponents_toNumber.reduce((hexText: string, comp: number) => { return  hexText += changeRGBComponentToHex(comp)}, '#');
  }

  function changeRGBComponentToHex(comp: number): string {
    const hex = comp.toString(16);
    return hex.length === 1 ?  "0" + hex : hex;
  }

  const validateInputValue = function(ev: Event) {
    const inputEl = ev.target as HTMLInputElement;

    const inputtedFontSizeValue = parseInt(inputEl.value) || fontSizeInput.min;

    inputEl.addEventListener('input', () => {

      if(inputEl.validity.patternMismatch) { inputEl.value = inputtedFontSizeValue.toString(); }
      else if(/^\d+$/.test(inputEl.value)) {
        if(parseInt(inputEl.value) > fontSizeInput.max) { inputEl.value = fontSizeInput.max.toString(); }
        fontSizeInput.current.value = parseInt(inputEl.value);
      }
      
    }, { once: true });

  }

  const correctDisplayedInputValue = function(ev: Event) {
    const inputEl = ev.target as HTMLInputElement;
    if((!/^[0-9]+$/.test(inputEl.value)) || (parseInt(inputEl.value) < fontSizeInput.min)) { fontSizeInput.current.value = fontSizeInput.min; }
    else if(parseInt(inputEl.value) > fontSizeInput.max) { fontSizeInput.current.value = fontSizeInput.max; }

    inputEl.value = fontSizeInput.current.value.toString();
    updateEditorFontSize();
  }

  const adjustFontSize = function(action: 'increase' | 'decrease') {
    const currentFontSize = retrieveFontSizeValue();
    if(action === 'decrease') { fontSizeInput.current.value = currentFontSize - ((currentFontSize === fontSizeInput.min)? 0 : 1) }
    else if(action === 'increase') { fontSizeInput.current.value = currentFontSize + ((currentFontSize === fontSizeInput.max)? 0 : 1) }
    updateEditorFontSize();
  }

  const updateEditorFontSize = () => editor?.value?.chain().focus().setFontSize(`${fontSizeInput.current.value}px`).run();

  const retrieveFontSizeValue = function(): number {
    const retrievedFontSize: string = editor?.value?.getAttributes('textStyle').fontSize || '';
    return retrievedFontSize === '' ?   fontSizeInput.default  :  parseInt(retrievedFontSize.replace(/\D+/g, ""));
  }

</script>

<template>
  <header class="sticky top-0 z-30">
    <div class="grid grid-rows-1 grid-cols-[1fr_2fr_1fr] py-4 px-8 w-full h-full bg-[#fff0] backdrop-blur-sm overflow-auto border-solid">
        <section id="toolset-documentinfo" class="grid grid-rows-[auto_auto] grid-cols-[auto_auto] place-content-start gap-x-6">
            <FontAwesomeIcon :icon="faFile" class="text-6xl text-[hsl(222,_40%,_40%)] row-start-1 row-span-2 drop-shadow-[0.1rem_0.1rem_0.1rem_hsl(222,_60%,_60%)] _documentIcon" />
            <div class="flex items-center gap-5">
                <p class="document-title text-2xl my-1"> Document </p>
                <FontAwesomeIcon :icon="faPencil" class="text-base text-[#333]" @click="" />
            </div>
            
            <span class="w-full text-xs row-start-2 col-start-2"> Last modified: Today </span>
        </section>

        <div class="grid grid-cols-7 grid-rows-auto gap-2 items-center justify-center">
            
          <div class="relative flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="`bg-[#eeeb]`"
                @click=""
            > 
                <FontAwesomeIcon :icon="faT" class="text-sm drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none
                  self-center mx-auto mb-[0.35rem]
                " />

                <input
                  title="font color"
                  placeholder="#222222"
                  id="textColorInput"
                  class="absolute top-0 left-0 w-full h-full pt-[1.15rem] px-[0.15rem] rounded bg-transparent hover:cursor-pointer"
                  type="color"
                  @input="(event: Event) => useInputColor(event)"
                  :value="(editor?.getAttributes('textStyle').color?.length)? convert_RGB_to_HEX(editor?.getAttributes('textStyle').color)  :  `#222222`"
                />
            </div>

            <div class="relative flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="`bg-[#eeeb]`"
                @click=""
            >
                <FontAwesomeIcon :icon="faPaintBrush" class="text-sm drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none 
                  self-center mx-auto mb-[0.35rem]"
                />

                <input
                  title="background color"
                  placeholder="#eeeeee"
                  id="backgroundColorInput"
                  class="absolute top-0 left-0 w-full h-full pt-[1.15rem] px-[0.15rem] rounded bg-transparent hover:cursor-pointer"
                  type="color"
                  @input="(event: Event) => useInputBackgroundColor(event)"
                  :value="(editor?.getAttributes('highlight')?.color)? editor?.getAttributes('highlight').color : `#eeeeee`"
                />
            </div>
          
            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('bold')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleBold()?.run()"
            > 
                <FontAwesomeIcon :icon="faBold" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none"
                  :class="editor?.isActive('bold')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4  rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('italic')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleItalic()?.run()"
            >
                <FontAwesomeIcon :icon="faItalic" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none"
                  :class="editor?.isActive('italic')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('underline')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleUnderline()?.run()"
            >
                <FontAwesomeIcon :icon="faUnderline" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" 
                  :class="editor?.isActive('underline')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('strike')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleStrike()?.run()"
            >
                <FontAwesomeIcon :icon="faStrikethrough" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" 
                  :class="editor?.isActive('strike')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div ref="linkButton" class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors
                "
                data-role="style"
                :class="trackButtonBg"
                @click.self="(event: MouseEvent) => {
                  if(!isTextSelected) { return; }
                  if(editor?.isActive('link')) handleCloseLink();
                  else createDialogBox('link', event.target); 
                }"
            >
                <FontAwesomeIcon :icon="faLink" class="text-base  drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" 
                  :class="editor?.isActive('link')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('subscript')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleSubscript()?.run()"
            >
                <FontAwesomeIcon :icon="faSubscript" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" 
                  :class="editor?.isActive('subscript')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="editor?.isActive('superscript')? `bg-[#222b]` : `bg-[#eeeb]`"
                @click="editor?.chain()?.focus()?.toggleSuperscript()?.run()"
            >
                <FontAwesomeIcon :icon="faSuperscript" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" 
                  :class="editor?.isActive('superscript')? `text-[#ddd]` : `text-[#333]`"
                />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="`bg-[#eeeb]`"
                @click=""
            >
                <FontAwesomeIcon :icon="faAngleUp" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                  transition-colors hover:cursor-pointer
                "
                data-role="style"
                :class="`bg-[#eeeb]`"
                @click=""
            >
                <FontAwesomeIcon :icon="faAngleDown" class="text-base drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" />
            </div>


            <!---->

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[#eeeb] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(122,_50%,_70%)]
                " 
                onclick="downloadtxt()"
            >
                <FontAwesomeIcon :icon="faDownload" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[#eeeb] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(122,_50%,_70%)]
                " 
                onclick="importTxtFile()"
            >
                <FontAwesomeIcon :icon="faCloud" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)] pointer-events-none" @click="" />
            </div>

        </div>

        <div class="flex items-center">

          <div class="grid items-center content-center grid-cols-[1fr_2fr_1fr] grid-rows-1 justify-center gap-x-1">

            <div class="group relative w-full h-full flex items-center">
              <div class="group-hover:bg-[#2225] group-hover:cursor-pointer absolute w-6 h-6 rounded mx-auto"
                @click="adjustFontSize('decrease')"
              ></div>
              <FontAwesomeIcon :icon="faMinus" class="text-lg p-1  pointer-events-none" />
            </div>

            <div>
              <input type="text" inputmode="numeric" min="6" max="96" pattern="^[1-9]+[0-9]*$" 
                class="text-sm w-10 font-semibold text-center py-1 px-1 outline-gray-500 bg-[#eee] border-2 border-[#222] appearance-none cursor-pointer rounded hover:cursor-text" 
                title="font size"
                list="availableFontSizes"
                :ref="fontSizeInput.DOMElement"
                :value="retrieveFontSizeValue()"
                :placeholder="fontSizeInput.min.toString()"
                @beforeinput="(ev) => validateInputValue(ev)"
                @focusout="(ev) => correctDisplayedInputValue(ev)"
              />
<!--               <datalist id="availableFontSizes" class="min-h-[40vh]">
                <option> 6 </option>
                <option> 8 </option>
                <option> 10 </option>
                <option> 12 </option>
                <option> 14 </option>
                <option> 16 </option>
                <option> 18 </option>
                <option> 24 </option>
                <option> 30 </option>
                <option> 36 </option>
                <option> 48 </option>
                <option> 60 </option>
                <option> 72 </option>
                <option> 96 </option>
              </datalist> -->
            </div>
            
            <div class="group relative w-full h-full flex items-center">
              <div class="group-hover:bg-[#2225] group-hover:cursor-pointer absolute w-6 h-6 rounded mx-auto"
                @click="adjustFontSize('increase')"
              ></div>
              <FontAwesomeIcon :icon="faPlus" class="text-lg p-1 pointer-events-none" />
            </div>

          </div>

        </div>

    </div>
  </header>

  <main>
    <section id="notebook" >

      <EditorContent :editor="editor" id=""
        class="workspace
          text-base min-h-screen w-[min(60%,_840px)] mx-auto my-12 px-9 py-16 bg-white rounded shadow-[0.1rem_0.1rem_0.3rem_0.3rem_#333]
        "
      />

    </section>
  </main>

  <div>
    <DialogBox v-if="dialogBoxType" :data="currentDialogBoxDetails"
      @handleCloseDialogBox="handleCloseDialogBox"
      @handleAddLink="handleAddLink"
    />
  </div>

</template>

<style scoped>

  .document-description {
    grid-row: 2; /* Do not remove this - as Tailwind alternative seems not to work */
    grid-column: 2; /* Do not remove this - as Tailwind alternative seems not to work */
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number]{
    -moz-appearance: textfield;
    appearance: textfield;
  }

</style>
