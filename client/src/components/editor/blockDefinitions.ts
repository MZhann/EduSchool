export interface TagDefinition {
  tag: string;
  label: string;
  category: string;
  selfClosing: boolean;
  canHaveChildren: boolean;
  canHaveText: boolean;
  attributes: string[];
  color: string;
}

export const TAG_DEFINITIONS: Record<string, TagDefinition> = {
  html: { tag: "html", label: "<html>", category: "Құрылым", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-violet-500/20 text-violet-700 border-violet-300" },
  head: { tag: "head", label: "<head>", category: "Құрылым", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-violet-500/20 text-violet-700 border-violet-300" },
  body: { tag: "body", label: "<body>", category: "Құрылым", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-violet-500/20 text-violet-700 border-violet-300" },
  title: { tag: "title", label: "<title>", category: "Құрылым", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-violet-500/20 text-violet-700 border-violet-300" },

  h1: { tag: "h1", label: "<h1>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },
  h2: { tag: "h2", label: "<h2>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },
  h3: { tag: "h3", label: "<h3>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },
  h4: { tag: "h4", label: "<h4>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },
  h5: { tag: "h5", label: "<h5>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },
  h6: { tag: "h6", label: "<h6>", category: "Тақырыптар", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-blue-500/20 text-blue-700 border-blue-300" },

  p: { tag: "p", label: "<p>", category: "Мәтін", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  strong: { tag: "strong", label: "<strong>", category: "Мәтін", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  em: { tag: "em", label: "<em>", category: "Мәтін", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  u: { tag: "u", label: "<u>", category: "Мәтін", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  span: { tag: "span", label: "<span>", category: "Мәтін", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  br: { tag: "br", label: "<br>", category: "Мәтін", selfClosing: true, canHaveChildren: false, canHaveText: false, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },
  hr: { tag: "hr", label: "<hr>", category: "Мәтін", selfClosing: true, canHaveChildren: false, canHaveText: false, attributes: [], color: "bg-green-500/20 text-green-700 border-green-300" },

  a: { tag: "a", label: "<a>", category: "Сілтемелер", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: ["href"], color: "bg-cyan-500/20 text-cyan-700 border-cyan-300" },
  img: { tag: "img", label: "<img>", category: "Медиа", selfClosing: true, canHaveChildren: false, canHaveText: false, attributes: ["src", "alt"], color: "bg-pink-500/20 text-pink-700 border-pink-300" },

  ul: { tag: "ul", label: "<ul>", category: "Тізімдер", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-orange-500/20 text-orange-700 border-orange-300" },
  ol: { tag: "ol", label: "<ol>", category: "Тізімдер", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-orange-500/20 text-orange-700 border-orange-300" },
  li: { tag: "li", label: "<li>", category: "Тізімдер", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-orange-500/20 text-orange-700 border-orange-300" },

  table: { tag: "table", label: "<table>", category: "Кестелер", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-amber-500/20 text-amber-700 border-amber-300" },
  tr: { tag: "tr", label: "<tr>", category: "Кестелер", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-amber-500/20 text-amber-700 border-amber-300" },
  th: { tag: "th", label: "<th>", category: "Кестелер", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-amber-500/20 text-amber-700 border-amber-300" },
  td: { tag: "td", label: "<td>", category: "Кестелер", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-amber-500/20 text-amber-700 border-amber-300" },

  form: { tag: "form", label: "<form>", category: "Формалар", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  input: { tag: "input", label: "<input>", category: "Формалар", selfClosing: true, canHaveChildren: false, canHaveText: false, attributes: ["type"], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  label: { tag: "label", label: "<label>", category: "Формалар", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  button: { tag: "button", label: "<button>", category: "Формалар", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  select: { tag: "select", label: "<select>", category: "Формалар", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  option: { tag: "option", label: "<option>", category: "Формалар", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },
  textarea: { tag: "textarea", label: "<textarea>", category: "Формалар", selfClosing: false, canHaveChildren: false, canHaveText: true, attributes: [], color: "bg-rose-500/20 text-rose-700 border-rose-300" },

  header: { tag: "header", label: "<header>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  footer: { tag: "footer", label: "<footer>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  nav: { tag: "nav", label: "<nav>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  main: { tag: "main", label: "<main>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  section: { tag: "section", label: "<section>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  article: { tag: "article", label: "<article>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },
  aside: { tag: "aside", label: "<aside>", category: "Семантика", selfClosing: false, canHaveChildren: true, canHaveText: false, attributes: [], color: "bg-indigo-500/20 text-indigo-700 border-indigo-300" },

  div: { tag: "div", label: "<div>", category: "Орналасу", selfClosing: false, canHaveChildren: true, canHaveText: true, attributes: [], color: "bg-slate-500/20 text-slate-700 border-slate-300" },
};

export function getTagDef(tag: string): TagDefinition {
  return TAG_DEFINITIONS[tag] || {
    tag,
    label: `<${tag}>`,
    category: "Басқа",
    selfClosing: false,
    canHaveChildren: true,
    canHaveText: true,
    attributes: [],
    color: "bg-gray-500/20 text-gray-700 border-gray-300",
  };
}
