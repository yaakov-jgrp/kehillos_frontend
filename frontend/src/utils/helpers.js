export function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}`;
  return formattedDate;
}

export function formatDateString(datetimeString) {
  const date = new Date(datetimeString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
}

export function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

export function transformFormDataForAddNewForm(data) {
  const formatConditions = (fieldId, conditions) => {
    return conditions
      .filter((condition) => condition.fieldId === fieldId)
      .map(({ field, condition, value, operator }) => ({
        field,
        condition,
        value,
        operator,
      }));
  };

  const formatFields = (blockId, fields, conditions) => {
    return fields
      .filter((field) => field.blockId === blockId)
      .map(
        ({
          name,
          data_type,
          enum_values,
          defaultvalue,
          field_width_percentage,
          required,
          unique,
          id,
        }) => ({
          name,
          data_type,
          enum_values,
          defaultvalue,
          field_width_percentage,
          required,
          unique,
          conditions: formatConditions(id, conditions),
        })
      );
  };

  const formattedBlocks = data.blocks.map((block) => ({
    name: block.name,
    isRepeatable: block.isRepeatable,
    fields: formatFields(block.id, data.fields, data.conditions),
  }));

  return {
    name: data.name,
    description: data.description,
    isPined: data.isPined,
    blocks: formattedBlocks,
  };
}

export function convertDataForShowingForms(input) {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString();
  }

  const output = {
    id: input.id,
    isPined: input.isPined,
    name: input.name,
    description: input.description.slice(0, 10),
    blocks: input.blocks.map((block) => ({
      formId: input.id,
      id: block.id,
      name: block.name,
      isRepeatable: block.isRepeatable,
    })),
    fields: input.blocks.flatMap((block) =>
      block.fields.map((field) => ({
        blockId: block.id,
        id: field.id,
        name: field.name,
        data_type: field.data_type,
        field_width_percentage: field?.field_width_percentage,
        enum_values: field.enum_values,
        defaultvalue: field.defaultvalue,
        required: field.required,
        unique: field.unique,
      }))
    ),
    conditions: input.blocks.flatMap((block) =>
      block.fields.flatMap((field) =>
        field.conditions.map((condition) => ({
          id: condition.id,
          fieldId: field.id,
          field: condition.field,
          condition: condition.condition,
          value: condition.value,
          operator: condition.operator,
        }))
      )
    ),
    createdAt: formatDate(input.createdAt),
    lastEditedAt: formatDate(input.lastEditedAt),
  };

  return output;
}

export function transformFormDataForUpdate(data) {
  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  // Helper function to remove IDs and format conditions
  const formatConditions = (fieldId, conditions) => {
    return conditions.filter(
      (condition) => condition.fieldId === fieldId && !isFloat(condition.id)
    );
  };

  // Helper function to remove IDs and format fields
  const formatFields = (blockId, fields, conditions) => {
    return fields
      .filter((field) => field.blockId === blockId && !isFloat(field.id))
      .map(
        ({
          blockId,
          name,
          data_type,
          enum_values,
          defaultvalue,
          field_width_percentage,
          required,
          unique,
          id,
        }) => ({
          id,
          blockId,
          name,
          data_type,
          enum_values,
          defaultvalue,
          field_width_percentage,
          required,
          unique,
          conditions: formatConditions(id, conditions),
        })
      );
  };

  // Remove IDs and format blocks with their respective fields
  const formattedBlocks = data.blocks
    .filter((block) => !isFloat(block.id))
    .map((block) => ({
      id: block.id,
      formId: block.formId,
      name: block.name,
      isRepeatable: block.isRepeatable,
      fields: formatFields(block.id, data.fields, data.conditions),
    }));

  // Return the final transformed data
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    isPined: data.isPined,
    blocks: formattedBlocks,
  };
}

export function transformFormDataForAddNewClientForm(data) {
  const formatFields = (blockId, fields) => {
    return fields
      .filter((field) => field.blockId === blockId)
      .map(
        ({ name, data_type, enum_values, defaultvalue, required, unique }) => ({
          name,
          data_type,
          enum_values,
          defaultvalue,
          required,
          unique,
        })
      );
  };

  const formattedBlocks = data.blocks.map((block) => ({
    name: block.name,
    isRepeatable: block.isRepeatable,
    fields: formatFields(block.id, data.fields),
  }));

  return {
    name: data.name,
    isPined: data.isPined,
    clientId: data.clientId,
    blocks: formattedBlocks,
  };
}

export function convertDataForShowingClientFormDetails(input) {
  const output = {
    id: input.id,
    isPined: input.isPined,
    name: input.name,
    clientId: input.clientId,
    blocks: input.blocks.map((block) => ({
      clientFormId: block.clientFormId,
      id: block.id,
      name: block.name,
      isRepeatable: block.isRepeatable,
    })),
    fields: input.blocks.flatMap((block) =>
      block.fields.map((field) => ({
        clientFormBlockId: block.id,
        id: field.id,
        name: field.name,
        data_type: field.data_type,
        enum_values: field.enum_values,
        defaultvalue: field.defaultvalue,
        required: field.required,
        unique: field.unique,
      }))
    ),
    versions: input.versions,
  };
  return output;
}
