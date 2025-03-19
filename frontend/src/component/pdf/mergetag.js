import { ZOOM } from "@pdfme/common";
import { text } from "@pdfme/schemas";
import clientsService from "../../services/clients";
import i18next from "i18next";
import { DEFAULT_LANGUAGE } from "../../constants";

const TextAlignCenterIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>';
const TextAlignLeftIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>';
const TextAlignRightIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>';
const TextAlignJustifyIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>';
const TextStrikethroughIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-1-2.8 0-5.3.9-5.3 3.5 0 1.8 1.2 2.5 4 3.3l-1.8.6"></path><path d="M12 19c2.8 0 5.3-.9 5.3-3.5 0-1.8-1.2-2.5-4-3.3l1.8-.6"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg>';
const TextUnderlineIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>';
const TextVerticalAlignTopIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3M16 3v3M4 7h16M4 11h16M4 15h16M4 19h16"></path></svg>';
const TextVerticalAlignMiddleIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9v2M16 9v2M4 13h16M4 17h16M4 5h16M4 21h16"></path></svg>';
const TextVerticalAlignBottomIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 15v3M16 15v3M4 19h16M4 15h16M4 11h16M4 7h16"></path></svg>';
const TextBoldIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>';
const TextItalicIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>';

const DEFAULT_OPACITY = 1;
const HEX_COLOR_PATTERN = "^#(?:[A-Fa-f0-9]{6})$";

const DEFAULT_FONT_SIZE = 13;
const ALIGN_LEFT = "left";
const ALIGN_CENTER = "center";
const ALIGN_RIGHT = "right";
const ALIGN_JUSTIFY = "justify";
const DEFAULT_ALIGNMENT = ALIGN_LEFT;
const VERTICAL_ALIGN_TOP = "top";
const VERTICAL_ALIGN_MIDDLE = "middle";
const VERTICAL_ALIGN_BOTTOM = "bottom";
const DEFAULT_VERTICAL_ALIGNMENT = VERTICAL_ALIGN_TOP;
const DEFAULT_LINE_HEIGHT = 1;
const DEFAULT_CHARACTER_SPACING = 0;
const DEFAULT_FONT_COLOR = "#000000";
const PLACEHOLDER_FONT_COLOR = "#A0A0A0";
const DYNAMIC_FIT_VERTICAL = "vertical";
const DYNAMIC_FIT_HORIZONTAL = "horizontal";
const DEFAULT_DYNAMIC_FIT = DYNAMIC_FIT_VERTICAL;
const DEFAULT_DYNAMIC_MIN_FONT_SIZE = 4;

const DEFAULT_DYNAMIC_MAX_FONT_SIZE = 72;
const FONT_SIZE_ADJUSTMENT = 0.25;

const DEFAULT_FONT_FAMILY = "Arial";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_ROTATION = 0;

// Formatter enum
export const Formatter = {
  STRIKETHROUGH: 'strikethrough',
  UNDERLINE: 'underline',
  ALIGNMENT: 'alignment',
  VERTICAL_ALIGNMENT: 'verticalAlignment',
  BOLD: 'bold',
  ITALIC: 'italic',
};

// Button types
export const GroupButtonTypes = {
  BOOLEAN: 'boolean',
  SELECT: 'select',
};

export const getExtraFormatterSchema = () => {
  const buttons = [
    { key: Formatter.STRIKETHROUGH, icon: TextStrikethroughIcon, type: GroupButtonTypes.BOOLEAN },
    { key: Formatter.UNDERLINE, icon: TextUnderlineIcon, type: GroupButtonTypes.BOOLEAN },
    { key: Formatter.BOLD, icon: TextBoldIcon, type: GroupButtonTypes.BOOLEAN },
    { key: Formatter.ITALIC, icon: TextItalicIcon, type: GroupButtonTypes.BOOLEAN },
    { key: Formatter.ALIGNMENT, icon: TextAlignLeftIcon, type: GroupButtonTypes.SELECT, value: DEFAULT_ALIGNMENT },
    { key: Formatter.ALIGNMENT, icon: TextAlignCenterIcon, type: GroupButtonTypes.SELECT, value: ALIGN_CENTER },
    { key: Formatter.ALIGNMENT, icon: TextAlignRightIcon, type: GroupButtonTypes.SELECT, value: ALIGN_RIGHT },
    { key: Formatter.ALIGNMENT, icon: TextAlignJustifyIcon, type: GroupButtonTypes.SELECT, value: ALIGN_JUSTIFY },
    {
      key: Formatter.VERTICAL_ALIGNMENT,
      icon: TextVerticalAlignTopIcon,
      type: GroupButtonTypes.SELECT,
      value: DEFAULT_VERTICAL_ALIGNMENT,
    },
    {
      key: Formatter.VERTICAL_ALIGNMENT,
      icon: TextVerticalAlignMiddleIcon,
      type: GroupButtonTypes.SELECT,
      value: VERTICAL_ALIGN_MIDDLE,
    },
    {
      key: Formatter.VERTICAL_ALIGNMENT,
      icon: TextVerticalAlignBottomIcon,
      type: GroupButtonTypes.SELECT,
      value: VERTICAL_ALIGN_BOTTOM,
    },
  ];

  return {
    title: "Format", //i18next.t('schemas.text.format'),
    widget: 'ButtonGroup',
    buttons,
    span: 24,
  };
};

const createMergeTagData = async () => {
  const t = i18next.t.bind(i18next);
  let clientTags = {};
  try {
    const res = await clientsService.getFullformEmailPageData(
      "&field_email_template=true"
    );
    clientTags = res.data.result.client || {};
  } catch (error) {
    console.error("Error fetching client tags:", error);
  }

  return {
    client: {
      name: t("email_builder.clients"),
      mergeTags: clientTags,
    },
  };
};

const createInlineEditor = (
  options,
  onChange,
  initialValue,
  stopEditing,
  schema,
  dir
) => {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.zIndex = "9999";
  container.style.backgroundColor = "#fff";
  container.style.borderRadius = "4px";
  container.style.fontSize = "16px";

  const textInput = document.createElement("textarea");
  textInput.style.width = "100%";
  textInput.style.minHeight = "60px";
  textInput.style.padding = "8px 12px";
  textInput.style.border = "1px solid #ddd";
  textInput.style.borderRadius = "4px";
  textInput.style.resize = "vertical";
  textInput.value = initialValue || "";
  textInput.dir = dir;

  // Apply styling to the editor element
  textInput.style.fontFamily = schema.fontName
    ? `'${schema.fontName}'`
    : schema.fontFamily || DEFAULT_FONT_FAMILY;
  textInput.style.fontSize = `${schema.fontSize || DEFAULT_FONT_SIZE}pt`;
  textInput.style.color = schema.fontColor || "#000000";
  textInput.style.textAlign = schema.alignment || (dir === "ltr" ? "left" : "right");
  textInput.style.lineHeight = `${schema.lineHeight || DEFAULT_LINE_HEIGHT}em`;
  textInput.style.letterSpacing = `${
    schema.characterSpacing || DEFAULT_CHARACTER_SPACING
  }pt`;
  textInput.style.whiteSpace = "pre-wrap";
  textInput.style.wordBreak = "break-word";
  textInput.style.width = "100%";
  textInput.style.height = "100%";
  textInput.style.outline = "none";
  textInput.style.backgroundColor = schema.backgroundColor || DEFAULT_BACKGROUND_COLOR;
  textInput.style.opacity = schema.opacity || DEFAULT_OPACITY;
  // textInput.style.transform = `rotate(${schema.rotation || DEFAULT_ROTATION}deg)`;
  textInput.style.fontWeight = schema.bold ? "bold" : "normal";
  textInput.style.fontStyle = schema.italic ? "italic" : "normal";
  const textDecorations = [];
  if (schema.strikethrough) textDecorations.push("line-through");
  if (schema.underline) textDecorations.push("underline");
  textInput.style.textDecoration = textDecorations.join(" ");

  const blurHandler = (e) => {
    if (onChange) onChange({ key: "content", value: textInput.value });
    if (stopEditing) stopEditing();
  };

  textInput.addEventListener("blur", blurHandler);

  const mergeTagBtn = document.createElement("button");
  mergeTagBtn.textContent = "+ Add Merge Tag";
  mergeTagBtn.style.position = "absolute";
  mergeTagBtn.style.left = "0";
  mergeTagBtn.style.top = "-30px";
  mergeTagBtn.style.padding = "4px 8px";
  mergeTagBtn.style.backgroundColor = "#1976d2";
  mergeTagBtn.style.color = "#fff";
  mergeTagBtn.style.border = "none";
  mergeTagBtn.style.borderRadius = "4px";
  mergeTagBtn.style.cursor = "pointer";
  mergeTagBtn.style.fontSize = "20px";

  const dropdownContainer = document.createElement("div");
  dropdownContainer.style.position = "absolute";
  dropdownContainer.style.top = "-32px";
  dropdownContainer.style.left = "50px";
  dropdownContainer.style.backgroundColor = "#fff";
  dropdownContainer.style.borderRadius = "4px";
  dropdownContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  dropdownContainer.style.display = "none";
  dropdownContainer.style.zIndex = "10000";

  Object.entries(options).forEach(([key, value]) => {
    const category = document.createElement("div");
    category.style.position = "relative";
    category.style.padding = "8px 12px";
    category.style.cursor = "pointer";
    category.style.borderBottom = "1px solid #eee";
    category.textContent = value.name;

    const submenu = document.createElement("div");
    submenu.style.position = "absolute";
    submenu.style.left = "100%";
    submenu.style.top = "0";
    submenu.style.backgroundColor = "#fff";
    submenu.style.border = "1px solid #ddd";
    submenu.style.borderRadius = "4px";
    submenu.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    submenu.style.display = "none";
    submenu.style.minWidth = "250px";

    Object.entries(value.mergeTags).forEach(([tagKey, tagValue]) => {
      const item = document.createElement("div");
      item.style.padding = "8px 12px";
      item.style.cursor = "pointer";
      item.style.borderBottom = "1px solid #eee";
      item.textContent = tagValue.name;

      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "#f5f5f5";
      });

      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "#fff";
      });

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const cursorPos = textInput.selectionStart;
        const textBefore = textInput.value.substring(0, cursorPos);
        const textAfter = textInput.value.substring(cursorPos);
        const newValue = textBefore + tagValue.value + textAfter;

        textInput.value = newValue;
        dropdownContainer.style.display = "none";

        requestAnimationFrame(() => {
          textInput.focus();
          const newCursorPos = cursorPos + tagValue.value.length;
          textInput.setSelectionRange(newCursorPos, newCursorPos);
        });
      });

      submenu.appendChild(item);
    });

    category.addEventListener("mouseenter", () => {
      category.style.backgroundColor = "#f5f5f5";
      const allSubmenus = dropdownContainer.querySelectorAll("[data-submenu]");
      allSubmenus.forEach((sm) => (sm.style.display = "none"));
      submenu.style.display = "block";
      textInput.removeEventListener("blur", blurHandler);
    });

    category.addEventListener("mouseleave", () => {
      category.style.backgroundColor = "#fff";
      textInput.addEventListener("blur", blurHandler);
    });

    submenu.setAttribute("data-submenu", "");
    category.appendChild(submenu);
    dropdownContainer.appendChild(category);
  });

  mergeTagBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownContainer.style.display =
      dropdownContainer.style.display === "none" ? "block" : "none";
  });

  mergeTagBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  document.addEventListener("click", () => {
    dropdownContainer.style.display = "none";
  });

  ["mousedown", "mouseup", "click"].forEach((eventName) => {
    container.addEventListener(eventName, (e) => {
      e.stopPropagation();
    });
  });

  container.appendChild(mergeTagBtn);
  container.appendChild(dropdownContainer);
  container.appendChild(textInput);

  return container;
};

export const mergetag = {
  ui: async (arg) => {
    const { schema, value, onChange, stopEditing, rootElement, mode } = arg;

    const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
    let dir;
    if (defaultLanguageValue === "he") {
      dir = "rtl";
    } else {
      dir = "ltr";
    }

    rootElement.innerHTML = ""; // Clear all children
    if (mode === "viewer" || (mode === "form" && schema.readOnly)) {
      const textElement = document.createElement("div");
      textElement.textContent = value || "";

      // Apply text styling similar to reference implementation
      textElement.style.fontFamily = schema.fontName
        ? `'${schema.fontName}'`
        : schema.fontFamily || DEFAULT_FONT_FAMILY;
      textElement.style.fontSize = `${schema.fontSize || DEFAULT_FONT_SIZE}pt`;
      textElement.style.color = schema.fontColor || "#000000";
      textElement.style.textAlign =
        schema.alignment || (dir === "ltr" ? "left" : "right");
      textElement.style.lineHeight = `${
        schema.lineHeight || DEFAULT_LINE_HEIGHT
      }em`;
      textElement.style.letterSpacing = `${
        schema.characterSpacing || DEFAULT_CHARACTER_SPACING
      }pt`;
      textElement.style.whiteSpace = "pre-wrap";
      textElement.style.wordBreak = "break-word";
      textElement.dir = dir;
      textElement.style.opacity = schema.opacity || DEFAULT_OPACITY;
      // textElement.style.transform = `rotate(${schema.rotation || DEFAULT_ROTATION}deg)`;
      textElement.style.fontWeight = schema.bold ? "bold" : "normal";
      textElement.style.fontStyle = schema.italic ? "italic" : "normal";
      textElement.style.backgroundColor = schema.backgroundColor || DEFAULT_BACKGROUND_COLOR;
      const textDecorations = [];
      if (schema.strikethrough) textDecorations.push("line-through");
      if (schema.underline) textDecorations.push("underline");
      textElement.style.textDecoration = textDecorations.join(" ");

      rootElement.appendChild(textElement);
      return;
    } else {
      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.padding = "4px";
      container.style.position = "relative";
      container.style.zIndex = "9999";
      container.style.backgroundColor = schema.backgroundColor || DEFAULT_BACKGROUND_COLOR;

      container.dir = dir;

      const mergeTagData = await createMergeTagData();
      const editor = createInlineEditor(
        mergeTagData,
        onChange,
        value,
        stopEditing,
        schema,
        dir
      );

      if (rootElement.innerHTML === "") {
        container.appendChild(editor);
        rootElement.appendChild(container);
      }
    }
  },
  pdf: text.pdf,
  propPanel: {
    schema: {
      formatter: getExtraFormatterSchema(),
      fontFamily: {
        title: "FontFamily", //i18next.t("schemas.text.fontFamily"),
        type: "string",
        widget: "select",
        span: 12,
        props: {
          options: [
            { label: "Arial", value: "Arial" },
            { label: "Arial Hebrew", value: "Arial Hebrew" },
            { label: "David", value: "David" },
            { label: "Frank Ruehl", value: "Frank Ruehl" },
            { label: "Times New Roman", value: "Times New Roman" },
            { label: "Helvetica", value: "Helvetica" },
            { label: "Noto Sans Hebrew", value: "Noto Sans Hebrew" },
            { label: "Courier New", value: "Courier New" },
            { label: "Georgia", value: "Georgia" },
            { label: "Verdana", value: "Verdana" },
            { label: "Tahoma", value: "Tahoma" }
          ],
        },
      },
      fontSize: {
        title: "Size",//i18next.t("schemas.text.size"),
        type: "number",
        widget: "inputNumber",
        span: 6,
        props: { min: 0 },
      },
      opacity: {
        title: "Opacity", //i18next.t("schemas.text.opacity"),
        type: "number",
        widget: "inputNumber",
        span: 6,
        props: { min: 0, max: 1, step: 0.1 },
      },
      fontColor: {
        title: "TextColor", //i18next.t("schemas.textColor"),
        type: "string",
        widget: "color",
        props: {
          disabledAlpha: true,
        },
        rules: [
          {
            pattern: HEX_COLOR_PATTERN,
            message: i18next.t("validation.hexColor"),
          },
        ],
      },
      lineHeight: {
        title: "LineHeight", //i18next.t("schemas.text.lineHeight"),
        type: "number",
        widget: "inputNumber",
        span: 6,
        props: { min: 1, max: 3, step: 0.1 },
      },
      backgroundColor: {
        title: "BackgroundColor", //i18next.t("schemas.backgroundColor"),
        type: "string",
        widget: "color",
        props: {
          disabledAlpha: true,
        },
        rules: [
          {
            pattern: HEX_COLOR_PATTERN,
            message: i18next.t("validation.hexColor"),
          },
        ],
      },
      letterSpacing: {
        title: "LetterSpacing", //i18next.t("schemas.text.letterSpacing"),
        type: "number",
        widget: "inputNumber",
        span: 6,
        props: { min: -2, max: 20, step: 0.5 },
      },
      // rotation: {
      //   title: "Rotation", //i18next.t("schemas.text.rotation"),
      //   type: "number",
      //   widget: "inputNumber",
      //   span: 6,
      //   props: { min: -180, max: 180, step: 1 },
      // },
    },
    defaultSchema: {
      name: "",
      type: "mergetag",
      content: "",
      position: { x: 0, y: 0 },
      width: 200,
      height: 80,
      rotate: 0,
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: DEFAULT_FONT_SIZE,
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      lineHeight: DEFAULT_LINE_HEIGHT,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      letterSpacing: DEFAULT_CHARACTER_SPACING,
      opacity: DEFAULT_OPACITY,
      alignment: null,
      fontColor: DEFAULT_FONT_COLOR,
    },
  },
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>',
};
