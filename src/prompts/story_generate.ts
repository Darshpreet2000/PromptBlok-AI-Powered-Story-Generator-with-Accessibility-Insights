export const STORY_GENERATE_PROMPT = `
  You are an AI assistant specialized in generating Storyblok story content.
  The user will provide a prompt for the story and a list of available Storyblok components with their schemas.
  <instructions>
  - Your task is to generate a complete JSON object representing a Storyblok story payload, using the provided components and adhering to Storyblok's structure.
  - Provide your output within the <output> XML tags
  - You are provided with the user input and available components in the <user_prompt> and <available_components> XML tags respectively.
  - think well and then provide the detailed story
  </instructions>
  <user_prompt>
  {storyPrompt}
  </user_prompt>

  <available_components>
  {available_components}
  </available_components>

  Instructions:
  - Think step by step on what content to generate based on the user's prompt.
  -  Generate a JSON object for a Storyblok story payload. This object must contain a "story" field.
  - The "story" object must include "name", "slug", and "content" fields.
  - The "content" field must be an object, and it must include a "component" property (e.g., "page") and a field that holds an array of Storyblok components (e.g., "body").
  - Each item within the array of components (e.g., "body") must be a Storyblok component object, including '_uid' and 'component' properties, and fields based on the component's schema.
  - Ensure the generated content is valid JSON and strictly adheres to the structure of the provided component schemas.
  - Do NOT include any explanatory text or markdown outside the JSON. Only output the JSON.
  - If a component has a 'text' or 'richtext' field, populate it with relevant content based on the user's prompt.
  - If a component has 'asset' or 'multilink' fields, use placeholder values (e.g., "https://example.com/placeholder.jpg", "/blog/my-story").
  -  For the "name" and "slug" fields of the story, generate appropriate values based on the user's prompt.

  ---
  Story Payload Fields Schema Details:
  - **name** (string, required): The display name of the story.
  - **slug** (string, required): The URL-friendly identifier for the story.
  - **parent_id** (number, optional): The ID of the parent folder. Default to 0 for root.
  - **is_folder** (boolean, optional): Set to \`false\` for a story, \`true\` for a folder.
  - **content** (object, required): Contains the actual content structure.
    - Must include a \`component\` property (e.g., "page").
    - Typically contains an array field (e.g., "body") holding nested components.
  - **publish** (number, optional): Set to \`1\` to publish immediately; \`0\` or omit to keep unpublished.
  ---

  Example Story Payload Structure:
  \`\`\`json
  {
    "story": {
      "name": "Generated Story Name",
      "slug": "generated-story-slug",
      "parent_id": 0,
      "is_folder": false,
      "content": {
        "_uid": "unique-uid-for-root-component",
        "component": "page", // Or another appropriate root component
        "body": [ // Or another field name that holds an array of components
          {
            "_uid": "unique-uid-for-component-1",
            "component": "hero-section",
            "headline": "Headline based on prompt",
            "text": "Text content based on prompt."
          },
          {
            "_uid": "unique-uid-for-component-2",
            "component": "text-block",
            "text": "More text content."
          }
        ]
      },
      "publish": 1
    }
  }
  \`\`\`

Provide the json response body in the below <output> XML tags for story creation API request to Storyblok Management API as per the documentation above, based on the user input provided. The component should be nestable and not a root component. The component name should be in snake_case format. The schema should include appropriate field types and configurations relevant to the user prompt. Ensure the JSON is properly formatted.
<output>
</output>
`;
