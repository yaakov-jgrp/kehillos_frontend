import { ZOOM } from "@pdfme/common";
import { text } from "@pdfme/schemas";
import clientsService from "../../services/clients";
import i18next from "i18next";
import { DEFAULT_LANGUAGE } from "../../constants";

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
    : "inherit";
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
  textInput.style.backgroundColor = "transparent";

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
        : "inherit";
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

      rootElement.appendChild(textElement);
      return;
    } else {
      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.padding = "4px";
      container.style.position = "relative";
      container.style.zIndex = "9999";
      container.style.backgroundColor = schema.backgroundColor || "transparent";

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
      fontSize: {
        title: i18next.t("schemas.text.size"),
        type: "number",
        widget: "inputNumber",
        span: 6,
        props: { min: 0 },
      },
      alignment: {
        title: i18next.t("schemas.text.alignment"),
        type: "string",
        widget: "select",
        props: {
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      fontColor: {
        title: i18next.t("schemas.textColor"),
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
    },
    defaultSchema: {
      name: "",
      type: "mergetag",
      content: "",
      position: { x: 0, y: 0 },
      width: 200,
      height: 80,
      fontSize: DEFAULT_FONT_SIZE,
      alignment: null,
      fontColor: DEFAULT_FONT_COLOR,
    },
  },
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>',
};
