/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- all exports are ImporterLocale which is already fully typed */
export const heIL = {
    general: {
        goToPreviousStepTooltip: 'עבור לשלב הקודם'
    },

    fileStep: {
        initialDragDropPrompt:
            'גרור ושחרר קובץ CSV כאן, או לחץ כדי לבחור בתיקייה',
        activeDragDropPrompt: 'שחרר כאן קובץ CSV...',

        getImportError: (message) => `שגיאת ייבוא: ${message}`,
        getDataFormatError: (message) => `אנא בדוק את עיצוב הנתונים: ${message}`,
        goBackButton: 'תחזור',
        nextButton: 'בחר עמודות',

        rawFileContentsHeading: 'תוכן קובץ גלם',
        previewImportHeading: 'תצוגה מקדימה של ייבוא',
        dataHasHeadersCheckbox: 'לנתונים יש כותרות',
        previewLoadingStatus: 'טוען תצוגה מקדימה...'
    },

    fieldsStep: {
        stepSubtitle: 'בחר עמודות',
        requiredFieldsError: 'אנא הקצה את כל השדות הנדרשים',
        nextButton: 'יְבוּא',

        dragSourceAreaCaption: 'עמודות לייבוא',
        getDragSourcePageIndicator: (currentPage, pageCount) =>
            `עמוד ${currentPage} שֶׁל ${pageCount}`,
        getDragSourceActiveStatus: (columnCode) =>
            `מקצה טור ${columnCode}`,
        nextColumnsTooltip: 'הצג את העמודות הבאות',
        previousColumnsTooltip: 'הצג עמודות קודמות',
        clearAssignmentTooltip: 'נקה הקצאת עמודות',
        selectColumnTooltip: 'בחר עמודה להקצאה',
        unselectColumnTooltip: 'בטל את בחירת העמודה',

        dragTargetAreaCaption: 'Target fields',
        getDragTargetOptionalCaption: (field) => `${field} (אופציונאלי)`,
        getDragTargetRequiredCaption: (field) => `${field} (נדרש)`,
        dragTargetPlaceholder: 'גרור את העמודה לכאן',
        getDragTargetAssignTooltip: (columnCode) =>
            `הקצה עמודה ${columnCode}`,
        dragTargetClearTooltip: 'נקה הקצאת עמודות',

        columnCardDummyHeader: 'שדה לא מוקצה',
        getColumnCardHeader: (code) => `טור ${code}`
    },

    progressStep: {
        stepSubtitle: 'יְבוּא',
        uploadMoreButton: 'העלה עוד',
        finishButton: 'סיים',
        statusError: 'לא ניתן לייבא',
        statusComplete: 'לְהַשְׁלִים',
        statusPending: 'מייבא...',
        processedRowsLabel: 'שורות מעובדות:'
    }
};