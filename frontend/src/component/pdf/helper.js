import {
  checkTemplate,
  getInputFromTemplate,
  getDefaultFont,
} from "@pdfme/common";
import { generate } from "@pdfme/generator";

import {
  multiVariableText,
  text,
  barcodes,
  image,
  svg,
  line,
  table,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  checkbox,
  radioGroup,
} from "@pdfme/schemas";
import { mergetag } from "./mergetag";
import { t } from "i18next";

export const getPlugins = () => {
  return {
    [t('pdfme.MergeTagEditor')]: mergetag,
    [t('pdfme.Text')]: text,
    [t('pdfme.MultiVariableText')]: multiVariableText,
    [t('pdfme.Table')]: table,
    [t('pdfme.Line')]: line,
    [t('pdfme.Rectangle')]: rectangle,
    [t('pdfme.Ellipse')]: ellipse,
    [t('pdfme.Image')]: image,
    [t('pdfme.SVG')]: svg,
    [t('pdfme.QR')]: barcodes.qrcode,
    [t('pdfme.DateTime')]: dateTime,
    [t('pdfme.Date')]: date,
    [t('pdfme.Time')]: time,
    [t('pdfme.Select')]: select,
    [t('pdfme.Checkbox')]: checkbox,
    [t('pdfme.RadioGroup')]: radioGroup,
    [t('pdfme.EAN13')]: barcodes.ean13,
    [t('pdfme.Code128')]: barcodes.code128,
  };
};

export function fromKebabCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getFontsData = () => ({
  ...getDefaultFont(),
  Arial: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/arimo/v28/P5sfzZCDf9_T_3cV7NCUECyoxNk37cxsBxDAVQI4aA.ttf", // Using Arimo as Arial alternative
  },
  DavidLibre: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/davidlibre/v14/snfus0W_99N64iuYSvp4W_l86p6TYS-Y.ttf",
  },
  David: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/davidlibre/v14/snfus0W_99N64iuYSvp4W_l86p6TYS-Y.ttf", // Using David Libre as David alternative
  },
  RubikHebrew: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4i1UE80V4bVkA.ttf",
  },
  Heebo: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/heebo/v21/NGSpv5_NC0k9P_v6ZUCbLRAHxK1EiSysdUmj.ttf",
  },
  Helvetica: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf", // Using Roboto as Helvetica alternative
  },
  Georgia: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZJ.ttf", // Using Merriweather as Georgia alternative
  },
  Tahoma: {
    fallback: false,
    data: "https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf", // Using Open Sans as Tahoma alternative
  },
  "PinyonScript-Regular": {
    fallback: false,
    data: "https://fonts.gstatic.com/s/pinyonscript/v22/6xKpdSJbL9-e9LuoeQiDRQR8aOLQO4bhiDY.ttf",
  },
});

export const readFile = (file, type) => {
  return new Promise((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === "text") {
        fileReader.readAsText(file);
      } else if (type === "dataURL") {
        fileReader.readAsDataURL(file);
      } else if (type === "arrayBuffer") {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

const getTemplateFromJsonFile = (file) => {
  return readFile(file, "text").then((jsonStr) => {
    const template = JSON.parse(jsonStr);
    checkTemplate(template);
    return template;
  });
};

export const downloadJsonFile = (json, title) => {
  if (typeof window !== "undefined") {
    const blob = new Blob([JSON.stringify(json)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const handleLoadTemplate = (e, currentRef) => {
  if (e.target && e.target.files && e.target.files[0]) {
    getTemplateFromJsonFile(e.target.files[0])
      .then((t) => {
        if (!currentRef) return;
        currentRef.updateTemplate(t);
      })
      .catch((e) => {
        alert(`Invalid template file. -------------------------- ${e}`);
      });
  }
};

export const translations = [
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "th", label: "Thai" },
  { value: "pl", label: "Polish" },
  { value: "it", label: "Italian" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
];

export const generatePDF = async (currentRef) => {
  if (!currentRef) return;
  const template = currentRef.getTemplate();
  const options = currentRef.getOptions();
  const inputs =
    typeof currentRef.getInputs === "function"
      ? currentRef.getInputs()
      : getInputFromTemplate(template);
  const font = getFontsData();

  try {
    const pdf = await generate({
      template,
      inputs,
      options: {
        font,
        lang: options.lang,
        title: "pdfme",
      },
      plugins: getPlugins(),
    });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    window.open(URL.createObjectURL(blob));
  } catch (e) {
    alert(e + "\n\nCheck the console for full stack trace");
    throw e;
  }
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getBlankTemplate = () => ({
  schemas: [{}],
  basePdf: {
    width: 210,
    height: 297,
    padding: [20, 10, 20, 10],
  },
});

export const getTemplateById = async (templateId) => {
  const template = await fetch(
    `/template-assets/${templateId}/template.json`
  ).then((res) => res.json());
  checkTemplate(template);
  return template;
};
