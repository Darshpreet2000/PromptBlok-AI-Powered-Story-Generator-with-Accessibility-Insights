export const componentGeneratePrompt = `You are an Assistant to create components directly for StoryBlok, you are provided with the necessary documentation in the below <documentation> xml tags, you are given user input in <input> XML tags, output the create component API request in the <output> XML tags
<documentation>

# Storyblok Field Types and Configurations

This document outlines the various field types available in Storyblok and their configuration options. Fields are content inputs that make up stories and blocks.

## 1. Generic Field Configuration Options

All field types (except \`group\`) share the following configuration options:

*   **Required** (boolean): Prevents saving when the field is empty.
*   **Display name** (string): Label for the field in the Visual Editor.
*   **Field name** (string): The key for the field on the API.
*   **Description** (string): Explanatory text under the field in the editor.
*   **Show description as tooltip** (boolean): Replaces description text with a tooltip.
*   **Translatable** (boolean): Allows translation when field-level translations are enabled (not applicable to \`block\` or \`group\` fields).
*   **Default value** (string): Initial value when the field, block, or story is created (not applicable to \`asset\`, \`multi-asset\`, \`link\`, \`table\`, \`group\`, or \`plugin\` fields).

## 2. Conditional Fields

Conditional fields can appear, disappear, or become required based on the values of other fields. This feature is plan-dependent.

## 3. Specific Field Types and Configurations

### Asset (Single or Multi)
Input to upload, browse, and select files hosted on Storyblok.

*   **Allow external URL** (boolean): Displays an input to link to an external file.
*   **Filetypes** (select): Restricts uploads to specific filetypes.
*   **Default assets folder** (select): Defines a starting location when opening the asset browser.

### Blocks
Input to add nested blocks.

*   **Allowed minimum** (number): Enforces a lower limit on the number of blocks.
*   **Allowed maximum** (number): Enforces an upper limit on the number of blocks.
*   **Allow only specific components to be inserted** (boolean): Restricts available blocks by component type, tag, or folder.

### Boolean
A toggle stored as \`true\` or \`false\`, defaulting to \`false\`.

*   **Inline label** (boolean): Displays label beside the toggle.

### Date/time
A picker for a date or timestamp stored as an ISO 8601 date value (YYYY-MM-DD HH:MM).

*   **Disable time selection** (boolean): Restricts input to only date.
    *   *Note:* UI time is based on account timezone; API returns UTC time.

### Group
A widget that toggles to reveal or hide other fields. It only affects the editor interface and has no impact on the API response.

### Link
A dynamic input to create a link to a website, story, asset, or email.

*   **Restrict to content types** (boolean): Restricts internal links to certain content types.
*   **Enable email field** (boolean): Allows an email input.
*   **Enable asset selection** (boolean): Allows an asset uploader/selector.
*   **Enable anchor field on internal link** (boolean): Displays a text input to manually define link IDs (e.g., \`example.com#example-id\`) on internal links.
*   **Allow links to open in new tab** (boolean): Displays an "Open in new window" toggle to define target as \`_self\` or \`_blank\`.
*   **Enable custom attributes** (boolean): Displays a form to add custom properties (e.g., \`title\`, \`rel\`) to the link object.
*   **Force folder restriction** (boolean): Restricts internal links to a specific folder.

### Markdown
A text input for formatted text stored as Markdown.

*   **Rich text as default** (boolean): Displays formatted text by default.
*   **Allow empty paragraphs** (boolean): Preserves empty space between paragraphs.
*   **Customize toolbar** (boolean): Configures formatting options in the toolbar.
*   **Maximum characters** (number): Sets a hard limit on text length.
*   **Enable RTL** (boolean): Allows right-to-left formatting.

### Number
A number input.

*   **Min value** (number): Prevents saving when input is below a limit.
*   **Max value** (number): Prevents saving when input is above a limit.
*   **Number of decimals** (number): Defines the number of allowed decimal places.
*   **Number of steps** (number): Defines an interval for increment/decrement buttons.

### Option (Single or Multi)
A dropdown to select one or more items from a list. Options can be key–value pairs, stories, datasources, languages, or properties from an API.

*   **Source** (select): Defines a source for the selection options.
*   **Minimum** (number): Enforces a lower limit on the number of items.
*   **Maximum** (number): Enforces an upper limit on the number of items.
    *   *Note:* Default value should be an array (e.g., \`["red","green"]\`). For API properties, use a JSON array of objects with \`value\` and \`name\` properties.

### Plugin
An extendable, customizable input. Refer to field plugins documentation for more information.

### References
Links to stories in the same space.

*   **Path to folder of stories** (string): Limits available stories to a folder.
*   **Restrict to content type** (select): Limits available stories by content type(s).
*   **Enable advanced search** (boolean): Enables search with filtering, sorting, and pagination.
*   **Appearance** (radio): Displays stories as a link or a card in the selector.
*   **Minimum** (number): Enforces a lower limit on the number of references.
*   **Maximum** (number): Enforces an upper limit on the number of references.

### Rich text
A text input for content with advanced and highly customizable formatting, stored as JSON (based on TipTap Editor).

*   **Maximum characters** (number): Limits the allowed number of characters.
*   **Custom CSS class** (object): Enables custom CSS classes.
*   **Customize toolbar items** (boolean): Changes formatting options in the toolbar.
*   **Allow only specific components to be inserted** (boolean): Restricts blocks allowed in rich text composing.
*   **Allow links to be open in a new tab** (boolean): Displays an "Open in new window" toggle in the link editor.
*   **Enable custom attributes** (boolean): Displays a form to add custom properties to the link object.

### Table
A simple table editor. The API returns this field separated by \`thead\` (first row) and \`tbody\` (following rows), with component identifiers (\`_table_head\`, \`_tablerow\`, \`_table_col\`).

### Text
A text input for short strings.

*   **Maximum characters** (number): Limits the allowed number of characters.
*   **Regex validation** (string): Prevents saving unless input matches a regex pattern.
*   **RTL** (boolean): Direction of text.

### Textarea
A text input for a paragraph without formatting.

*   **Maximum characters** (number): Limits the allowed number of characters.
*   **Regex validation** (string): Prevents saving unless input matches a regex pattern.
*   **RTL** (boolean): Direction of text.

## 4. Deprecated Fields

*   \`Image\`
*   \`File\`


# Storyblok Management API: Possible Field Types

This document lists the possible field types available in Storyblok's Management API.

| Field Type   | Description                                                                                             |
| :----------- | :------------------------------------------------------------------------------------------------------ |
| \`bloks\`      | Blocks: A field to interleave other components in your current one.                                     |
| \`text\`       | Text: A single-line text field.                                                                         |
| \`textarea\`   | Textarea: A multi-line text area.                                                                       |
| \`richtext\`   | Richtext: A rich text field with advanced formatting options.                                           |
| \`markdown\`   | Markdown: A text area for writing Markdown with additional formatting options.                          |
| \`number\`     | Number: A field for numerical input.                                                                    |
| \`datetime\`   | Date/Time: A date and time picker.                                                                      |
| \`boolean\`    | Boolean: A checkbox for true/false values.                                                              |
| \`option\`     | Single-Option: A dropdown for selecting a single item.                                                  |
| \`options\`    | Multi-Options: A list of checkboxes allowing multi-selection.                                           |
| \`asset\`      | Asset: For a single asset (images, videos, audio, and documents).                                       |
| \`multiasset\` | Multi-Assets: For multiple assets (images, videos, audio, and documents).                               |
| \`multilink\`  | Link: An input field for adding links (internal stories, emails, external URLs, etc.).                  |
| \`table\`      | Table: A field for tabular data.                                                                        |
| \`section\`    | Group: No input possibility; allows grouping fields in sections within the editor interface.            |
| \`custom\`     | Plugin: Extend the editor with custom functionalities (e.g., color picker). See Introduction to Field Plugins. |
| \`image\`      | Image (old): Deprecated upload field for a single image with cropping possibilities.                    |
| \`file\`       | File (old): Deprecated upload field for a single file.                                                  |

**Example Object Structure:**

\`\`\`json
"field_key": {
  // ... other properties
  "type": "text", // <-- field type
  // ... other properties
}
\`\`\`


# Storyblok Component Object and Management API

This document describes the Storyblok Component Object and how to create components using the Management API.

## 1. Component Object Overview

A Component Object represents a component within a Storyblok space. Some properties are read-only, while others can be managed via the Management API.

**Key Naming Fields:**
*   \`name\` (string): Technical name used for component properties in entries. This is shown to the user in the content editor if \`display_name\` is null.
*   \`display_name\` (string): Name that will be used in the editor interface.
*   \`real_name\` (string): Read-only, used internally by Storyblok. If \`display_name\` is null, \`real_name\` is set to \`name\`. Otherwise, it takes the value of \`display_name\`. Use \`name\` and \`display_name\` for general purposes.

**Nesting Behavior:**
*   If both \`is_nestable\` and \`is_root\` properties are \`false\`, the component is nestable.

**Properties:**

| Property Name           | Type      | Description                                                              |
| :---------------------- | :-------- | :----------------------------------------------------------------------- |
| \`id\`                    | \`number\`  | The numeric ID of the component.                                         |
| \`name\`                  | \`string\`  | Technical name used for component property in entries.                   |
| \`display_name\`          | \`string\`  | Name shown in the editor interface.                                      |
| \`created_at\`            | \`string\`  | Creation date (Format: \`yyyy-MM-dd'T'HH:mm:ssZ\`).                        |
| \`updated_at\`            | \`string\`  | Latest update date (Format: \`yyyy-MM-dd'T'HH:mm:ssZ\`).                   |
| \`schema\`                | \`object\`  | Key-value pairs defining component fields.                               |
| \`image\`                 | \`string\` or \`null\` | URL to the preview image, if uploaded.                                   |
| \`preview_field\`         | \`string\`  | The field used for preview in the interface.                             |
| \`is_root\`               | \`boolean\` | \`true\` if the component can be used as a Content Type.                   |
| \`preview_tmpl\`          | \`string\`  | Component preview template.                                              |
| \`is_nestable\`           | \`boolean\` | \`true\` if the component is nestable (insertable) in block field types.   |
| \`all_presets\`           | \`object[]\`| An array of presets for this component.                                  |
| \`real_name\`             | \`string\`  | Duplicated technical name or display name, used for internal tasks.      |
| \`component_group_uuid\`  | \`string\`  | The component folder ID of the component.                                |
| \`color\`                 | \`string\`  | The color of the icon selected for the component.                        |
| \`icon\`                  | \`string\`  | Icon selected for the component.                                         |
| \`internal_tags_list\`    | \`object[]\`| List of objects containing details of tags used for the component.       |
| \`internal_tag_ids\`      | \`string[]\`| List of IDs of tags assigned to the component.                           |
| \`content_type_asset_preview\` | \`string\`  | Asset preview field (Preview Card) for a content type component.         |

## 2. Create a Component via Management API

**Endpoint:**
\`POST https://mapi.storyblok.com/v1/spaces/:space_id/components/\`

**Path Parameters:**
*   \`:space_id\` (required, number): Numeric ID of a space.

**Request Body (\`component\` object):**

| Property Name           | Type      | Required | Description                                                              |
| :---------------------- | :-------- | :------- | :----------------------------------------------------------------------- |
| \`name\`                  | \`string\`  | Yes      | Technical name used for component property in entries.                   |
| \`display_name\`          | \`string\`  | No       | Name that will be used in the editor interface.                          |
| \`schema\`                | \`object\`  | No       | Key-value pairs defining component fields.                               |
| \`image\`                 | \`string\` or \`null\` | No       | URL to the preview image, if uploaded.                                   |
| \`preview_field\`         | \`string\`  | No       | The field used for preview in the interface.                             |
| \`is_root\`               | \`boolean\` | No       | \`true\` if the component can be used as a Content Type.                   |
| \`preview_tmpl\`          | \`string\`  | No       | Component preview template.                                              |
| \`is_nestable\`           | \`boolean\` | No       | \`true\` if the component is nestable (insertable) in block field types.   |
| \`component_group_uuid\`  | \`string\`  | No       | The component folder ID of the component.                                |
| \`color\`                 | \`string\`  | No       | The color of the icon selected for the component.                        |
| \`icon\`                  | \`string\`  | No       | Icon selected for the component.                                         |
| \`internal_tag_ids\`      | \`string[]\`| No       | List of IDs of tags assigned to the component.                           |
| \`content_type_asset_preview\` | \`string\`  | No       | Asset preview field (Preview Card) for a content type component.         |

**Response Body (\`component\` object):**
The response body contains the full Component Object, including all properties listed in the "Component Object Overview" section, with \`id\`, \`created_at\`, and \`updated_at\` populated.

</documentation>


<input>
userPrompt
</input>

Provide the json response body in the below <output> XML tags for component creation API request to Storyblok Management API as per the documentation above, based on the user input provided. The component should be nestable and not a root component. The component name should be in snake_case format. The schema should include appropriate field types and configurations relevant to the user prompt. Ensure the JSON is properly formatted.
<output>
</output>
`;
