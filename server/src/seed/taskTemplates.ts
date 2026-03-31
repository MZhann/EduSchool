interface TaskTemplate {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  titleTemplate: string;
  descriptionTemplate: string;
  instructionTemplate: string;
  availableTags: string[];
  generator: (variant: number) => {
    title: string;
    description: string;
    instruction: string;
    expectedBlocks: any[];
    expectedHtml: string;
  };
}

const names = ["Айдар", "Дана", "Арман", "Мадина", "Ерлан", "Аяна", "Болат", "Жанна", "Нурлан", "Камила", "Тимур", "Алия", "Самат", "Гүлнар", "Рустем"];
const cities = ["Алматы", "Астана", "Шымкент", "Караганда", "Ақтау", "Атырау", "Павлодар", "Семей", "Тараз", "Өскемен"];
const animals = ["cat", "dog", "bird", "fish", "horse", "rabbit", "turtle", "eagle", "wolf", "fox"];
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white", "gray"];
const fruits = ["apple", "banana", "cherry", "grape", "lemon", "mango", "orange", "peach", "pear", "plum"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Literature", "Art", "Music", "Sports"];
const hobbies = ["reading", "painting", "swimming", "cycling", "cooking", "gardening", "photography", "dancing", "singing", "hiking"];
const foods = ["pizza", "pasta", "salad", "soup", "bread", "rice", "fish", "chicken", "cake", "ice cream"];
const seasons = ["Spring", "Summer", "Autumn", "Winter"];
const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length];
}

export const taskTemplates: TaskTemplate[] = [
  // ===== TOPIC 1: HTML BASICS (60 tasks) =====
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "HTML Basics",
    difficulty: "easy",
    titleTemplate: `Basic HTML Page - Variant ${i + 1}`,
    descriptionTemplate: "Create a basic HTML page structure",
    instructionTemplate: "Build a simple HTML page",
    availableTags: ["html", "head", "title", "body"],
    generator: (v) => {
      const name = pick(names, v);
      const title = `${name}'s Page`;
      return {
        title: `Create a page titled "${title}"`,
        description: `Build a basic HTML page with the title "${title}". Use the html, head, title, and body tags.`,
        instruction: `Drag the HTML structure blocks in the correct order. Set the page title to "${title}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [
              { tag: "title", content: title }
            ]},
            { tag: "body", content: "" }
          ]}
        ],
        expectedHtml: `<html><head><title>${title}</title></head><body></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "HTML Basics",
    difficulty: "easy",
    titleTemplate: `Page with greeting - Variant ${i + 1}`,
    descriptionTemplate: "Create a page with a greeting in the body",
    instructionTemplate: "Build a page with text content",
    availableTags: ["html", "head", "title", "body", "p"],
    generator: (v) => {
      const city = pick(cities, v);
      const greeting = `Welcome to ${city}!`;
      return {
        title: `Page with greeting: "${greeting}"`,
        description: `Create an HTML page with the body containing a paragraph that says "${greeting}".`,
        instruction: `Build the HTML structure and add a paragraph element with the text "${greeting}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Greeting" }]},
            { tag: "body", children: [{ tag: "p", content: greeting }] }
          ]}
        ],
        expectedHtml: `<html><head><title>Greeting</title></head><body><p>${greeting}</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "HTML Basics",
    difficulty: "medium",
    titleTemplate: `Multiple paragraphs - Variant ${i + 1}`,
    descriptionTemplate: "Create a page with multiple paragraphs",
    instructionTemplate: "Build a page with multiple text blocks",
    availableTags: ["html", "head", "title", "body", "p"],
    generator: (v) => {
      const subj = pick(subjects, v);
      const hobby = pick(hobbies, v + 3);
      return {
        title: `Page about ${subj} and ${hobby}`,
        description: `Create a page with a title "${subj}" and two paragraphs in the body.`,
        instruction: `Build the page. First paragraph: "I study ${subj} at school." Second paragraph: "My hobby is ${hobby}."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "p", content: `I study ${subj} at school.` },
              { tag: "p", content: `My hobby is ${hobby}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><p>I study ${subj} at school.</p><p>My hobby is ${hobby}.</p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 2: HEADINGS (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Headings",
    difficulty: "easy",
    titleTemplate: `Single heading - Variant ${i + 1}`,
    descriptionTemplate: "Create a page with a heading",
    instructionTemplate: "Add a heading to your page",
    availableTags: ["html", "head", "title", "body", "h1"],
    generator: (v) => {
      const animal = pick(animals, v);
      return {
        title: `Page with h1 heading about ${animal}`,
        description: `Create a page with an h1 heading that says "My favorite animal: ${animal}".`,
        instruction: `Build the HTML structure and add an h1 element with the text "My favorite animal: ${animal}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Animals" }]},
            { tag: "body", children: [
              { tag: "h1", content: `My favorite animal: ${animal}` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Animals</title></head><body><h1>My favorite animal: ${animal}</h1></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Headings",
    difficulty: "medium",
    titleTemplate: `Heading hierarchy - Variant ${i + 1}`,
    descriptionTemplate: "Create proper heading hierarchy",
    instructionTemplate: "Use h1 and h2 headings",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "p"],
    generator: (v) => {
      const subj = pick(subjects, v);
      const topic1 = pick(hobbies, v);
      return {
        title: `Heading hierarchy for ${subj}`,
        description: `Create a page with h1 "${subj}" and h2 "Chapter: ${topic1}" followed by a paragraph.`,
        instruction: `Build the HTML with proper heading hierarchy. h1 for the main title, h2 for the chapter.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "h1", content: subj },
              { tag: "h2", content: `Chapter: ${topic1}` },
              { tag: "p", content: `This chapter is about ${topic1}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><h1>${subj}</h1><h2>Chapter: ${topic1}</h2><p>This chapter is about ${topic1}.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Headings",
    difficulty: "hard",
    titleTemplate: `Full heading structure - Variant ${i + 1}`,
    descriptionTemplate: "Use h1 through h3 with content",
    instructionTemplate: "Create a document with three heading levels",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "h3", "p"],
    generator: (v) => {
      const planet = pick(planets, v);
      return {
        title: `Article about ${planet}`,
        description: `Create a structured page about ${planet} using h1, h2, h3 headings.`,
        instruction: `Build: h1 "${planet}", h2 "Overview", p with description, h2 "Facts", h3 "Size", p with size info.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: planet }]},
            { tag: "body", children: [
              { tag: "h1", content: planet },
              { tag: "h2", content: "Overview" },
              { tag: "p", content: `${planet} is a planet in our solar system.` },
              { tag: "h2", content: "Facts" },
              { tag: "h3", content: "Size" },
              { tag: "p", content: `${planet} has a unique size compared to Earth.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${planet}</title></head><body><h1>${planet}</h1><h2>Overview</h2><p>${planet} is a planet in our solar system.</p><h2>Facts</h2><h3>Size</h3><p>${planet} has a unique size compared to Earth.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Headings",
    difficulty: "easy",
    titleTemplate: `Simple h2 heading - Variant ${i + 1}`,
    descriptionTemplate: "Create a page with h2 heading",
    instructionTemplate: "Add h2 heading to page",
    availableTags: ["html", "head", "title", "body", "h2"],
    generator: (v) => {
      const fruit = pick(fruits, v);
      return {
        title: `Page with h2 about ${fruit}`,
        description: `Create a simple page with an h2 heading "${fruit}".`,
        instruction: `Build an HTML page with an h2 heading that contains the text "${fruit}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Fruits" }]},
            { tag: "body", children: [{ tag: "h2", content: fruit }] }
          ]}
        ],
        expectedHtml: `<html><head><title>Fruits</title></head><body><h2>${fruit}</h2></body></html>`,
      };
    },
  })),

  // ===== TOPIC 3: TEXT FORMATTING (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Text Formatting",
    difficulty: "easy",
    titleTemplate: `Bold text - Variant ${i + 1}`,
    descriptionTemplate: "Use strong tag for bold text",
    instructionTemplate: "Make text bold",
    availableTags: ["html", "head", "title", "body", "p", "strong"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `Bold name: ${name}`,
        description: `Create a paragraph where the name "${name}" is bold.`,
        instruction: `Build a paragraph: "My name is " then bold "${name}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Bold Text" }]},
            { tag: "body", children: [
              { tag: "p", content: "My name is ", children: [
                { tag: "strong", content: name }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Bold Text</title></head><body><p>My name is <strong>${name}</strong></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Text Formatting",
    difficulty: "easy",
    titleTemplate: `Italic text - Variant ${i + 1}`,
    descriptionTemplate: "Use em tag for italic text",
    instructionTemplate: "Make text italic",
    availableTags: ["html", "head", "title", "body", "p", "em"],
    generator: (v) => {
      const city = pick(cities, v);
      return {
        title: `Italic city: ${city}`,
        description: `Create a paragraph where "${city}" is italicized.`,
        instruction: `Build: "I live in " then italic "${city}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Cities" }]},
            { tag: "body", children: [
              { tag: "p", content: "I live in ", children: [
                { tag: "em", content: city }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Cities</title></head><body><p>I live in <em>${city}</em></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Text Formatting",
    difficulty: "medium",
    titleTemplate: `Mixed formatting - Variant ${i + 1}`,
    descriptionTemplate: "Combine bold and italic",
    instructionTemplate: "Use both strong and em",
    availableTags: ["html", "head", "title", "body", "p", "strong", "em"],
    generator: (v) => {
      const name = pick(names, v);
      const hobby = pick(hobbies, v + 2);
      return {
        title: `Formatted bio for ${name}`,
        description: `Create a paragraph with bold name and italic hobby.`,
        instruction: `Build: bold "${name}" then " enjoys " then italic "${hobby}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Bio" }]},
            { tag: "body", children: [
              { tag: "p", children: [
                { tag: "strong", content: name },
                { tag: "em", content: hobby }
              ], content: " enjoys " }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Bio</title></head><body><p><strong>${name}</strong> enjoys <em>${hobby}</em></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Text Formatting",
    difficulty: "hard",
    titleTemplate: `Full formatted article - Variant ${i + 1}`,
    descriptionTemplate: "Create a formatted article",
    instructionTemplate: "Use multiple text formatting tags",
    availableTags: ["html", "head", "title", "body", "h1", "p", "strong", "em", "u"],
    generator: (v) => {
      const subj = pick(subjects, v);
      return {
        title: `Formatted ${subj} article`,
        description: `Create a page with heading, paragraphs with bold, italic, and underlined text.`,
        instruction: `Build: h1 "${subj}", paragraph with bold keyword, paragraph with italic and underline.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "h1", content: subj },
              { tag: "p", children: [{ tag: "strong", content: subj }], content: " is an important subject." },
              { tag: "p", children: [
                { tag: "em", content: "Study" },
                { tag: "u", content: "every day" }
              ], content: " hard " }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><h1>${subj}</h1><p><strong>${subj}</strong> is an important subject.</p><p><em>Study</em> hard <u>every day</u></p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 4: LINKS (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Links",
    difficulty: "easy",
    titleTemplate: `Simple link - Variant ${i + 1}`,
    descriptionTemplate: "Create a hyperlink",
    instructionTemplate: "Add a link to your page",
    availableTags: ["html", "head", "title", "body", "a"],
    generator: (v) => {
      const city = pick(cities, v);
      return {
        title: `Link to ${city} page`,
        description: `Create a link that says "Visit ${city}" pointing to "#${city.toLowerCase()}".`,
        instruction: `Add an anchor tag with text "Visit ${city}" and href "#${city.toLowerCase()}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Links" }]},
            { tag: "body", children: [
              { tag: "a", content: `Visit ${city}`, attributes: { href: `#${city.toLowerCase()}` } }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Links</title></head><body><a href="#${city.toLowerCase()}">Visit ${city}</a></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Links",
    difficulty: "medium",
    titleTemplate: `Multiple links - Variant ${i + 1}`,
    descriptionTemplate: "Create navigation with links",
    instructionTemplate: "Build a page with multiple links",
    availableTags: ["html", "head", "title", "body", "h1", "p", "a"],
    generator: (v) => {
      const subj1 = pick(subjects, v);
      const subj2 = pick(subjects, v + 3);
      return {
        title: `Navigation for ${subj1} and ${subj2}`,
        description: `Create a page with a heading and two links to different subjects.`,
        instruction: `Build: h1 "Subjects", then two paragraphs each containing a link.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Subjects" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Subjects" },
              { tag: "p", children: [{ tag: "a", content: subj1, attributes: { href: `#${subj1.toLowerCase()}` } }] },
              { tag: "p", children: [{ tag: "a", content: subj2, attributes: { href: `#${subj2.toLowerCase()}` } }] }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Subjects</title></head><body><h1>Subjects</h1><p><a href="#${subj1.toLowerCase()}">${subj1}</a></p><p><a href="#${subj2.toLowerCase()}">${subj2}</a></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Links",
    difficulty: "hard",
    titleTemplate: `Links with formatting - Variant ${i + 1}`,
    descriptionTemplate: "Combine links with text formatting",
    instructionTemplate: "Build a page with formatted links",
    availableTags: ["html", "head", "title", "body", "h1", "p", "a", "strong"],
    generator: (v) => {
      const name = pick(names, v);
      const hobby = pick(hobbies, v + 1);
      return {
        title: `${name}'s portfolio with links`,
        description: `Create a page with bold heading, paragraph with a bold link.`,
        instruction: `Build h1 "${name}'s Portfolio", paragraph with bold link to "${hobby}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name}'s Portfolio` }]},
            { tag: "body", children: [
              { tag: "h1", content: `${name}'s Portfolio` },
              { tag: "p", content: "Check out my ", children: [
                { tag: "a", attributes: { href: `#${hobby}` }, children: [
                  { tag: "strong", content: hobby }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name}'s Portfolio</title></head><body><h1>${name}'s Portfolio</h1><p>Check out my <a href="#${hobby}"><strong>${hobby}</strong></a></p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 5: IMAGES (40 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Images",
    difficulty: "easy",
    titleTemplate: `Single image - Variant ${i + 1}`,
    descriptionTemplate: "Add an image to a page",
    instructionTemplate: "Insert an image with alt text",
    availableTags: ["html", "head", "title", "body", "img"],
    generator: (v) => {
      const animal = pick(animals, v);
      return {
        title: `Image of a ${animal}`,
        description: `Add an image of a ${animal} with proper alt text.`,
        instruction: `Add an img tag with src "${animal}.jpg" and alt "A ${animal}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Images" }]},
            { tag: "body", children: [
              { tag: "img", attributes: { src: `${animal}.jpg`, alt: `A ${animal}` } }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Images</title></head><body><img src="${animal}.jpg" alt="A ${animal}"></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Images",
    difficulty: "medium",
    titleTemplate: `Image with caption - Variant ${i + 1}`,
    descriptionTemplate: "Add image with heading and paragraph",
    instructionTemplate: "Create image gallery item",
    availableTags: ["html", "head", "title", "body", "h2", "img", "p"],
    generator: (v) => {
      const fruit = pick(fruits, v);
      return {
        title: `${fruit} gallery item`,
        description: `Create a page with an h2 title, image, and caption paragraph.`,
        instruction: `h2 "${fruit}", img with src="${fruit}.jpg" alt="${fruit}", p "A delicious ${fruit}."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Gallery" }]},
            { tag: "body", children: [
              { tag: "h2", content: fruit },
              { tag: "img", attributes: { src: `${fruit}.jpg`, alt: fruit } },
              { tag: "p", content: `A delicious ${fruit}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Gallery</title></head><body><h2>${fruit}</h2><img src="${fruit}.jpg" alt="${fruit}"><p>A delicious ${fruit}.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 10 }, (_, i): TaskTemplate => ({
    topic: "Images",
    difficulty: "hard",
    titleTemplate: `Image gallery - Variant ${i + 1}`,
    descriptionTemplate: "Create a multi-image gallery",
    instructionTemplate: "Build a gallery with multiple images",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "img", "p"],
    generator: (v) => {
      const a1 = pick(animals, v);
      const a2 = pick(animals, v + 3);
      return {
        title: `Animal gallery: ${a1} and ${a2}`,
        description: `Create a gallery page with two images and captions.`,
        instruction: `h1 "Animal Gallery", then for each: h2 with name, img, p with description.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Animal Gallery" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Animal Gallery" },
              { tag: "h2", content: a1 },
              { tag: "img", attributes: { src: `${a1}.jpg`, alt: a1 } },
              { tag: "p", content: `This is a ${a1}.` },
              { tag: "h2", content: a2 },
              { tag: "img", attributes: { src: `${a2}.jpg`, alt: a2 } },
              { tag: "p", content: `This is a ${a2}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Animal Gallery</title></head><body><h1>Animal Gallery</h1><h2>${a1}</h2><img src="${a1}.jpg" alt="${a1}"><p>This is a ${a1}.</p><h2>${a2}</h2><img src="${a2}.jpg" alt="${a2}"><p>This is a ${a2}.</p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 6: LISTS (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Lists",
    difficulty: "easy",
    titleTemplate: `Unordered list - Variant ${i + 1}`,
    descriptionTemplate: "Create an unordered list",
    instructionTemplate: "Build a bullet point list",
    availableTags: ["html", "head", "title", "body", "h2", "ul", "li"],
    generator: (v) => {
      const f1 = pick(fruits, v);
      const f2 = pick(fruits, v + 2);
      const f3 = pick(fruits, v + 5);
      return {
        title: `Fruit list: ${f1}, ${f2}, ${f3}`,
        description: `Create an unordered list with three fruits.`,
        instruction: `Build: h2 "Fruits", then ul with three li items: "${f1}", "${f2}", "${f3}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Fruits" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Fruits" },
              { tag: "ul", children: [
                { tag: "li", content: f1 },
                { tag: "li", content: f2 },
                { tag: "li", content: f3 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Fruits</title></head><body><h2>Fruits</h2><ul><li>${f1}</li><li>${f2}</li><li>${f3}</li></ul></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Lists",
    difficulty: "easy",
    titleTemplate: `Ordered list - Variant ${i + 1}`,
    descriptionTemplate: "Create an ordered list",
    instructionTemplate: "Build a numbered list",
    availableTags: ["html", "head", "title", "body", "h2", "ol", "li"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      const s3 = pick(subjects, v + 4);
      return {
        title: `Favorite subjects: ${s1}, ${s2}, ${s3}`,
        description: `Create an ordered list of favorite subjects.`,
        instruction: `Build: h2 "My Favorite Subjects", then ol with "${s1}", "${s2}", "${s3}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Subjects" }]},
            { tag: "body", children: [
              { tag: "h2", content: "My Favorite Subjects" },
              { tag: "ol", children: [
                { tag: "li", content: s1 },
                { tag: "li", content: s2 },
                { tag: "li", content: s3 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Subjects</title></head><body><h2>My Favorite Subjects</h2><ol><li>${s1}</li><li>${s2}</li><li>${s3}</li></ol></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Lists",
    difficulty: "medium",
    titleTemplate: `Mixed lists - Variant ${i + 1}`,
    descriptionTemplate: "Combine ordered and unordered lists",
    instructionTemplate: "Build both types of lists",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "ul", "ol", "li"],
    generator: (v) => {
      const h1 = pick(hobbies, v);
      const h2 = pick(hobbies, v + 3);
      const f1 = pick(foods, v);
      const f2 = pick(foods, v + 2);
      return {
        title: `Hobbies and foods lists`,
        description: `Create a page with an ordered list of hobbies and unordered list of foods.`,
        instruction: `h1 "My Lists", h2 "Hobbies" with ol, h2 "Foods" with ul.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "My Lists" }]},
            { tag: "body", children: [
              { tag: "h1", content: "My Lists" },
              { tag: "h2", content: "Hobbies" },
              { tag: "ol", children: [
                { tag: "li", content: h1 },
                { tag: "li", content: h2 }
              ]},
              { tag: "h2", content: "Foods" },
              { tag: "ul", children: [
                { tag: "li", content: f1 },
                { tag: "li", content: f2 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>My Lists</title></head><body><h1>My Lists</h1><h2>Hobbies</h2><ol><li>${h1}</li><li>${h2}</li></ol><h2>Foods</h2><ul><li>${f1}</li><li>${f2}</li></ul></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Lists",
    difficulty: "hard",
    titleTemplate: `Nested list - Variant ${i + 1}`,
    descriptionTemplate: "Create nested lists",
    instructionTemplate: "Build a list with sub-items",
    availableTags: ["html", "head", "title", "body", "h1", "ul", "ol", "li"],
    generator: (v) => {
      const s = pick(subjects, v);
      const t1 = pick(hobbies, v);
      const t2 = pick(hobbies, v + 3);
      return {
        title: `Nested list for ${s}`,
        description: `Create a list with nested sub-items.`,
        instruction: `h1 "${s}", ul with li "${s}" containing a nested ol with "${t1}" and "${t2}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: s }]},
            { tag: "body", children: [
              { tag: "h1", content: s },
              { tag: "ul", children: [
                { tag: "li", content: s, children: [
                  { tag: "ol", children: [
                    { tag: "li", content: t1 },
                    { tag: "li", content: t2 }
                  ]}
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${s}</title></head><body><h1>${s}</h1><ul><li>${s}<ol><li>${t1}</li><li>${t2}</li></ol></li></ul></body></html>`,
      };
    },
  })),

  // ===== TOPIC 7: TABLES (60 tasks) =====
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Tables",
    difficulty: "easy",
    titleTemplate: `Simple table - Variant ${i + 1}`,
    descriptionTemplate: "Create a basic table",
    instructionTemplate: "Build a table with rows",
    availableTags: ["html", "head", "title", "body", "h2", "table", "tr", "th", "td"],
    generator: (v) => {
      const n = pick(names, v);
      const c = pick(cities, v);
      return {
        title: `Student info table for ${n}`,
        description: `Create a table with Name and City columns.`,
        instruction: `Build table with header row (th: "Name", "City") and data row (td: "${n}", "${c}").`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Students" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Students" },
              { tag: "table", children: [
                { tag: "tr", children: [
                  { tag: "th", content: "Name" },
                  { tag: "th", content: "City" }
                ]},
                { tag: "tr", children: [
                  { tag: "td", content: n },
                  { tag: "td", content: c }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Students</title></head><body><h2>Students</h2><table><tr><th>Name</th><th>City</th></tr><tr><td>${n}</td><td>${c}</td></tr></table></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Tables",
    difficulty: "medium",
    titleTemplate: `Multi-row table - Variant ${i + 1}`,
    descriptionTemplate: "Create a table with multiple rows",
    instructionTemplate: "Build a table with multiple data rows",
    availableTags: ["html", "head", "title", "body", "h1", "table", "tr", "th", "td"],
    generator: (v) => {
      const n1 = pick(names, v);
      const n2 = pick(names, v + 3);
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      return {
        title: `Schedule table with ${n1} and ${n2}`,
        description: `Create a table with Student and Subject columns and two data rows.`,
        instruction: `h1 "Class Schedule", table header: "Student", "Subject"; row1: "${n1}", "${s1}"; row2: "${n2}", "${s2}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Schedule" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Class Schedule" },
              { tag: "table", children: [
                { tag: "tr", children: [{ tag: "th", content: "Student" }, { tag: "th", content: "Subject" }]},
                { tag: "tr", children: [{ tag: "td", content: n1 }, { tag: "td", content: s1 }]},
                { tag: "tr", children: [{ tag: "td", content: n2 }, { tag: "td", content: s2 }]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Schedule</title></head><body><h1>Class Schedule</h1><table><tr><th>Student</th><th>Subject</th></tr><tr><td>${n1}</td><td>${s1}</td></tr><tr><td>${n2}</td><td>${s2}</td></tr></table></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Tables",
    difficulty: "hard",
    titleTemplate: `Complex table - Variant ${i + 1}`,
    descriptionTemplate: "Create a table with 3 columns and 3 rows",
    instructionTemplate: "Build a comprehensive data table",
    availableTags: ["html", "head", "title", "body", "h1", "table", "tr", "th", "td"],
    generator: (v) => {
      const n1 = pick(names, v);
      const n2 = pick(names, v + 2);
      const n3 = pick(names, v + 4);
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 1);
      const s3 = pick(subjects, v + 3);
      return {
        title: `Grade table for three students`,
        description: `Create a table with Student, Subject, Grade columns and three data rows.`,
        instruction: `h1 "Grades", table with 3 columns and 3 data rows.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Grades" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Grades" },
              { tag: "table", children: [
                { tag: "tr", children: [{ tag: "th", content: "Student" }, { tag: "th", content: "Subject" }, { tag: "th", content: "Grade" }]},
                { tag: "tr", children: [{ tag: "td", content: n1 }, { tag: "td", content: s1 }, { tag: "td", content: "90" }]},
                { tag: "tr", children: [{ tag: "td", content: n2 }, { tag: "td", content: s2 }, { tag: "td", content: "85" }]},
                { tag: "tr", children: [{ tag: "td", content: n3 }, { tag: "td", content: s3 }, { tag: "td", content: "92" }]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Grades</title></head><body><h1>Grades</h1><table><tr><th>Student</th><th>Subject</th><th>Grade</th></tr><tr><td>${n1}</td><td>${s1}</td><td>90</td></tr><tr><td>${n2}</td><td>${s2}</td><td>85</td></tr><tr><td>${n3}</td><td>${s3}</td><td>92</td></tr></table></body></html>`,
      };
    },
  })),

  // ===== TOPIC 8: FORMS (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Forms",
    difficulty: "easy",
    titleTemplate: `Simple input - Variant ${i + 1}`,
    descriptionTemplate: "Create a form with an input",
    instructionTemplate: "Build a basic form",
    availableTags: ["html", "head", "title", "body", "h2", "form", "label", "input", "button"],
    generator: (v) => {
      const field = pick(["Name", "Email", "Phone", "Address", "City", "Age", "School", "Country", "Password", "Username"], v);
      return {
        title: `Form with ${field} input`,
        description: `Create a form with a labeled ${field} input and a submit button.`,
        instruction: `Build: h2 "Registration", form with label "${field}:", input, and button "Submit".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Form" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Registration" },
              { tag: "form", children: [
                { tag: "label", content: `${field}:` },
                { tag: "input", attributes: { type: "text" } },
                { tag: "button", content: "Submit" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Form</title></head><body><h2>Registration</h2><form><label>${field}:</label><input type="text"><button>Submit</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Forms",
    difficulty: "medium",
    titleTemplate: `Multi-field form - Variant ${i + 1}`,
    descriptionTemplate: "Create a form with multiple inputs",
    instructionTemplate: "Build a form with several fields",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "button"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `Registration form for ${name}`,
        description: `Create a form with Name, Email fields and Submit button.`,
        instruction: `h1 "Sign Up", form with two labeled inputs (Name, Email) and a Submit button.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Sign Up" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Sign Up" },
              { tag: "form", children: [
                { tag: "label", content: "Name:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Email:" },
                { tag: "input", attributes: { type: "email" } },
                { tag: "button", content: "Sign Up" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Sign Up</title></head><body><h1>Sign Up</h1><form><label>Name:</label><input type="text"><label>Email:</label><input type="email"><button>Sign Up</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Forms",
    difficulty: "hard",
    titleTemplate: `Select form - Variant ${i + 1}`,
    descriptionTemplate: "Create a form with select dropdown",
    instructionTemplate: "Build a form with select element",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "select", "option", "button"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      const s3 = pick(subjects, v + 5);
      return {
        title: `Subject selection form`,
        description: `Create a form with name input and subject dropdown.`,
        instruction: `h1 "Enrollment", form with name input, select with options: "${s1}", "${s2}", "${s3}", and Submit button.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Enrollment" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Enrollment" },
              { tag: "form", children: [
                { tag: "label", content: "Name:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Subject:" },
                { tag: "select", children: [
                  { tag: "option", content: s1 },
                  { tag: "option", content: s2 },
                  { tag: "option", content: s3 }
                ]},
                { tag: "button", content: "Enroll" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Enrollment</title></head><body><h1>Enrollment</h1><form><label>Name:</label><input type="text"><label>Subject:</label><select><option>${s1}</option><option>${s2}</option><option>${s3}</option></select><button>Enroll</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Forms",
    difficulty: "hard",
    titleTemplate: `Textarea form - Variant ${i + 1}`,
    descriptionTemplate: "Create a form with textarea",
    instructionTemplate: "Build a feedback form",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "textarea", "button"],
    generator: (v) => {
      const subj = pick(subjects, v);
      return {
        title: `Feedback form for ${subj}`,
        description: `Create a form with name input, textarea for feedback, and submit button.`,
        instruction: `h1 "${subj} Feedback", form with "Name" input, "Comments" textarea, and "Send" button.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Feedback" }]},
            { tag: "body", children: [
              { tag: "h1", content: `${subj} Feedback` },
              { tag: "form", children: [
                { tag: "label", content: "Name:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Comments:" },
                { tag: "textarea", content: "" },
                { tag: "button", content: "Send" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Feedback</title></head><body><h1>${subj} Feedback</h1><form><label>Name:</label><input type="text"><label>Comments:</label><textarea></textarea><button>Send</button></form></body></html>`,
      };
    },
  })),

  // ===== TOPIC 9: SEMANTIC HTML (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Semantic HTML",
    difficulty: "medium",
    titleTemplate: `Semantic structure - Variant ${i + 1}`,
    descriptionTemplate: "Use semantic HTML elements",
    instructionTemplate: "Build a page with semantic tags",
    availableTags: ["html", "head", "title", "body", "header", "main", "footer", "h1", "p"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `Semantic page for ${name}`,
        description: `Create a page using header, main, and footer elements.`,
        instruction: `Build: header with h1 "${name}'s Site", main with paragraph, footer with copyright.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name}'s Site` }]},
            { tag: "body", children: [
              { tag: "header", children: [{ tag: "h1", content: `${name}'s Site` }] },
              { tag: "main", children: [{ tag: "p", content: `Welcome to ${name}'s website.` }] },
              { tag: "footer", children: [{ tag: "p", content: `© 2026 ${name}` }] }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name}'s Site</title></head><body><header><h1>${name}'s Site</h1></header><main><p>Welcome to ${name}'s website.</p></main><footer><p>© 2026 ${name}</p></footer></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Semantic HTML",
    difficulty: "medium",
    titleTemplate: `Nav and sections - Variant ${i + 1}`,
    descriptionTemplate: "Use nav and section elements",
    instructionTemplate: "Build navigation and sections",
    availableTags: ["html", "head", "title", "body", "header", "nav", "section", "h1", "h2", "p", "a"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 3);
      return {
        title: `Page with nav: ${s1}, ${s2}`,
        description: `Create a page with navigation and two sections.`,
        instruction: `header with nav (two links), section for "${s1}" and section for "${s2}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "School" }]},
            { tag: "body", children: [
              { tag: "header", children: [
                { tag: "nav", children: [
                  { tag: "a", content: s1, attributes: { href: `#${s1.toLowerCase()}` } },
                  { tag: "a", content: s2, attributes: { href: `#${s2.toLowerCase()}` } }
                ]}
              ]},
              { tag: "section", children: [
                { tag: "h2", content: s1 },
                { tag: "p", content: `Learn about ${s1}.` }
              ]},
              { tag: "section", children: [
                { tag: "h2", content: s2 },
                { tag: "p", content: `Learn about ${s2}.` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>School</title></head><body><header><nav><a href="#${s1.toLowerCase()}">${s1}</a><a href="#${s2.toLowerCase()}">${s2}</a></nav></header><section><h2>${s1}</h2><p>Learn about ${s1}.</p></section><section><h2>${s2}</h2><p>Learn about ${s2}.</p></section></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Semantic HTML",
    difficulty: "hard",
    titleTemplate: `Full semantic page - Variant ${i + 1}`,
    descriptionTemplate: "Build a complete semantic page",
    instructionTemplate: "Use all semantic elements",
    availableTags: ["html", "head", "title", "body", "header", "nav", "main", "article", "aside", "footer", "h1", "h2", "p", "a"],
    generator: (v) => {
      const name = pick(names, v);
      const subj = pick(subjects, v);
      return {
        title: `Full semantic page by ${name}`,
        description: `Create a complete semantic page with header, nav, main, article, aside, and footer.`,
        instruction: `Build a full page structure: header with h1 and nav, main with article about ${subj} and aside with a tip, footer with copyright.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name}'s Blog` }]},
            { tag: "body", children: [
              { tag: "header", children: [
                { tag: "h1", content: `${name}'s Blog` },
                { tag: "nav", children: [
                  { tag: "a", content: "Home", attributes: { href: "#home" } },
                  { tag: "a", content: "About", attributes: { href: "#about" } }
                ]}
              ]},
              { tag: "main", children: [
                { tag: "article", children: [
                  { tag: "h2", content: subj },
                  { tag: "p", content: `Today we learn about ${subj}.` }
                ]},
                { tag: "aside", children: [
                  { tag: "p", content: "Tip: Practice every day!" }
                ]}
              ]},
              { tag: "footer", children: [
                { tag: "p", content: `© 2026 ${name}` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name}'s Blog</title></head><body><header><h1>${name}'s Blog</h1><nav><a href="#home">Home</a><a href="#about">About</a></nav></header><main><article><h2>${subj}</h2><p>Today we learn about ${subj}.</p></article><aside><p>Tip: Practice every day!</p></aside></main><footer><p>© 2026 ${name}</p></footer></body></html>`,
      };
    },
  })),

  // ===== TOPIC 10: DIV & LAYOUT (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Div and Span",
    difficulty: "easy",
    titleTemplate: `Div wrapper - Variant ${i + 1}`,
    descriptionTemplate: "Use div as a container",
    instructionTemplate: "Wrap content in a div",
    availableTags: ["html", "head", "title", "body", "div", "h2", "p"],
    generator: (v) => {
      const color = pick(colors, v);
      return {
        title: `Div container - ${color} theme`,
        description: `Create a page with content wrapped in a div.`,
        instruction: `Build: div containing h2 "Section" and p "This is the ${color} section."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Divs" }]},
            { tag: "body", children: [
              { tag: "div", children: [
                { tag: "h2", content: "Section" },
                { tag: "p", content: `This is the ${color} section.` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Divs</title></head><body><div><h2>Section</h2><p>This is the ${color} section.</p></div></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Div and Span",
    difficulty: "medium",
    titleTemplate: `Multiple divs - Variant ${i + 1}`,
    descriptionTemplate: "Create a multi-div layout",
    instructionTemplate: "Build multiple div sections",
    availableTags: ["html", "head", "title", "body", "div", "h1", "h2", "p", "span"],
    generator: (v) => {
      const c1 = pick(colors, v);
      const c2 = pick(colors, v + 3);
      return {
        title: `Two-section layout: ${c1} and ${c2}`,
        description: `Create a page with two div sections.`,
        instruction: `h1 "Layout", div with h2 "${c1} Section" and p, div with h2 "${c2} Section" and p with span.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Layout" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Layout" },
              { tag: "div", children: [
                { tag: "h2", content: `${c1} Section` },
                { tag: "p", content: `This is the ${c1} area.` }
              ]},
              { tag: "div", children: [
                { tag: "h2", content: `${c2} Section` },
                { tag: "p", content: "Highlight: ", children: [
                  { tag: "span", content: c2 }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Layout</title></head><body><h1>Layout</h1><div><h2>${c1} Section</h2><p>This is the ${c1} area.</p></div><div><h2>${c2} Section</h2><p>Highlight: <span>${c2}</span></p></div></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Div and Span",
    difficulty: "hard",
    titleTemplate: `Card layout - Variant ${i + 1}`,
    descriptionTemplate: "Create a card-based layout",
    instructionTemplate: "Build card components with divs",
    availableTags: ["html", "head", "title", "body", "div", "h1", "h3", "p", "img", "a"],
    generator: (v) => {
      const a1 = pick(animals, v);
      const a2 = pick(animals, v + 4);
      return {
        title: `Animal cards: ${a1} and ${a2}`,
        description: `Create a card layout with two animal cards.`,
        instruction: `h1 "Animals", two divs each with h3, img, p, and a link.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Animals" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Animals" },
              { tag: "div", children: [
                { tag: "h3", content: a1 },
                { tag: "img", attributes: { src: `${a1}.jpg`, alt: a1 } },
                { tag: "p", content: `The ${a1} is amazing.` },
                { tag: "a", content: "Learn more", attributes: { href: `#${a1}` } }
              ]},
              { tag: "div", children: [
                { tag: "h3", content: a2 },
                { tag: "img", attributes: { src: `${a2}.jpg`, alt: a2 } },
                { tag: "p", content: `The ${a2} is wonderful.` },
                { tag: "a", content: "Learn more", attributes: { href: `#${a2}` } }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Animals</title></head><body><h1>Animals</h1><div><h3>${a1}</h3><img src="${a1}.jpg" alt="${a1}"><p>The ${a1} is amazing.</p><a href="#${a1}">Learn more</a></div><div><h3>${a2}</h3><img src="${a2}.jpg" alt="${a2}"><p>The ${a2} is wonderful.</p><a href="#${a2}">Learn more</a></div></body></html>`,
      };
    },
  })),
];
