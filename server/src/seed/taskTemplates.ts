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
const animals = ["мысық", "ит", "құс", "балық", "жылқы", "қоян", "тасбақа", "бүркіт", "қасқыр", "түлкі"];
const colors = ["қызыл", "көк", "жасыл", "сары", "қызғылт сары", "күлгін", "қызғылт", "қара", "ақ", "сұр"];
const fruits = ["алма", "банан", "шие", "жүзім", "лимон", "манго", "апельсин", "шабдалы", "алмұрт", "өрік"];
const subjects = ["Математика", "Физика", "Химия", "Биология", "Тарих", "География", "Әдебиет", "Өнер", "Музыка", "Дене шынықтыру"];
const hobbies = ["оқу", "сурет салу", "жүзу", "велосипед тебу", "ас пісіру", "бақша өсіру", "фотография", "би", "ән айту", "саяхат"];
const foods = ["пицца", "макарон", "салат", "сорпа", "нан", "күріш", "балық", "тауық", "торт", "балмұздақ"];
const seasons = ["Көктем", "Жаз", "Күз", "Қыс"];
const planets = ["Меркурий", "Венера", "Жер", "Марс", "Юпитер", "Сатурн", "Уран", "Нептун"];

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length];
}

export const taskTemplates: TaskTemplate[] = [
  // ===== TOPIC 1: HTML НЕГІЗДЕРІ (60 tasks) =====
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "HTML негіздері",
    difficulty: "easy",
    titleTemplate: `Негізгі HTML парақша - Нұсқа ${i + 1}`,
    descriptionTemplate: "Негізгі HTML парақша құрылымын жасаңыз",
    instructionTemplate: "Қарапайым HTML парақша жасаңыз",
    availableTags: ["html", "head", "title", "body"],
    generator: (v) => {
      const name = pick(names, v);
      const title = `${name} парақшасы`;
      return {
        title: `Парақша жасаңыз, тақырыбы "${title}"`,
        description: `Негізгі HTML парақша жасаңыз, тақырыбы "${title}". html, head, title және body тегтерін қолданыңыз.`,
        instruction: `HTML құрылым блоктарын дұрыс ретпен сүйреңіз. Парақша тақырыбын "${title}" деп орнатыңыз.`,
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
    topic: "HTML негіздері",
    difficulty: "easy",
    titleTemplate: `Сәлемдесу бар парақша - Нұсқа ${i + 1}`,
    descriptionTemplate: "Денесінде сәлемдесуі бар парақша жасаңыз",
    instructionTemplate: "Мәтіні бар парақша жасаңыз",
    availableTags: ["html", "head", "title", "body", "p"],
    generator: (v) => {
      const city = pick(cities, v);
      const greeting = `${city} қаласына қош келдіңіз!`;
      return {
        title: `Сәлемдесу бар парақша: "${greeting}"`,
        description: `HTML парақша жасаңыз, денесінде "${greeting}" деген абзац болсын.`,
        instruction: `HTML құрылымын жасаңыз және "${greeting}" мәтіні бар абзац элементін қосыңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Сәлемдесу" }]},
            { tag: "body", children: [{ tag: "p", content: greeting }] }
          ]}
        ],
        expectedHtml: `<html><head><title>Сәлемдесу</title></head><body><p>${greeting}</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "HTML негіздері",
    difficulty: "medium",
    titleTemplate: `Бірнеше абзац - Нұсқа ${i + 1}`,
    descriptionTemplate: "Бірнеше абзацы бар парақша жасаңыз",
    instructionTemplate: "Бірнеше мәтін блогы бар парақша жасаңыз",
    availableTags: ["html", "head", "title", "body", "p"],
    generator: (v) => {
      const subj = pick(subjects, v);
      const hobby = pick(hobbies, v + 3);
      return {
        title: `${subj} және ${hobby} туралы парақша`,
        description: `"${subj}" тақырыбы және денесінде екі абзацы бар парақша жасаңыз.`,
        instruction: `Парақша жасаңыз. Бірінші абзац: "Мен мектепте ${subj} оқимын." Екінші абзац: "Менің хоббим - ${hobby}."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "p", content: `Мен мектепте ${subj} оқимын.` },
              { tag: "p", content: `Менің хоббим - ${hobby}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><p>Мен мектепте ${subj} оқимын.</p><p>Менің хоббим - ${hobby}.</p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 2: ТАҚЫРЫПТАР (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тақырыптар",
    difficulty: "easy",
    titleTemplate: `Жалғыз тақырып - Нұсқа ${i + 1}`,
    descriptionTemplate: "Тақырыбы бар парақша жасаңыз",
    instructionTemplate: "Парақшаңызға тақырып қосыңыз",
    availableTags: ["html", "head", "title", "body", "h1"],
    generator: (v) => {
      const animal = pick(animals, v);
      return {
        title: `${animal} туралы h1 тақырыбы бар парақша`,
        description: `"Менің сүйікті жануарым: ${animal}" деген h1 тақырыбы бар парақша жасаңыз.`,
        instruction: `HTML құрылымын жасаңыз және "Менің сүйікті жануарым: ${animal}" мәтіні бар h1 элементін қосыңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Жануарлар" }]},
            { tag: "body", children: [
              { tag: "h1", content: `Менің сүйікті жануарым: ${animal}` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Жануарлар</title></head><body><h1>Менің сүйікті жануарым: ${animal}</h1></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тақырыптар",
    difficulty: "medium",
    titleTemplate: `Тақырып иерархиясы - Нұсқа ${i + 1}`,
    descriptionTemplate: "Дұрыс тақырып иерархиясын жасаңыз",
    instructionTemplate: "h1 және h2 тақырыптарын қолданыңыз",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "p"],
    generator: (v) => {
      const subj = pick(subjects, v);
      const topic1 = pick(hobbies, v);
      return {
        title: `${subj} үшін тақырып иерархиясы`,
        description: `h1 "${subj}" және h2 "Тарау: ${topic1}" тақырыптары мен абзацы бар парақша жасаңыз.`,
        instruction: `Дұрыс тақырып иерархиясымен HTML жасаңыз. h1 - негізгі тақырып, h2 - тарау.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "h1", content: subj },
              { tag: "h2", content: `Тарау: ${topic1}` },
              { tag: "p", content: `Бұл тарау ${topic1} туралы.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><h1>${subj}</h1><h2>Тарау: ${topic1}</h2><p>Бұл тарау ${topic1} туралы.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тақырыптар",
    difficulty: "hard",
    titleTemplate: `Толық тақырып құрылымы - Нұсқа ${i + 1}`,
    descriptionTemplate: "h1-ден h3-ке дейін мазмұнмен қолданыңыз",
    instructionTemplate: "Үш деңгейлі тақырыптары бар құжат жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "h3", "p"],
    generator: (v) => {
      const planet = pick(planets, v);
      return {
        title: `${planet} туралы мақала`,
        description: `${planet} туралы h1, h2, h3 тақырыптарымен құрылымдалған парақша жасаңыз.`,
        instruction: `Жасаңыз: h1 "${planet}", h2 "Шолу", сипаттамасы бар p, h2 "Фактілер", h3 "Өлшемі", өлшемі туралы ақпараты бар p.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: planet }]},
            { tag: "body", children: [
              { tag: "h1", content: planet },
              { tag: "h2", content: "Шолу" },
              { tag: "p", content: `${planet} - біздің Күн жүйесіндегі ғаламшар.` },
              { tag: "h2", content: "Фактілер" },
              { tag: "h3", content: "Өлшемі" },
              { tag: "p", content: `${planet}-тің Жерге қарағанда ерекше өлшемі бар.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${planet}</title></head><body><h1>${planet}</h1><h2>Шолу</h2><p>${planet} - біздің Күн жүйесіндегі ғаламшар.</p><h2>Фактілер</h2><h3>Өлшемі</h3><p>${planet}-тің Жерге қарағанда ерекше өлшемі бар.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тақырыптар",
    difficulty: "easy",
    titleTemplate: `Қарапайым h2 тақырып - Нұсқа ${i + 1}`,
    descriptionTemplate: "h2 тақырыбы бар парақша жасаңыз",
    instructionTemplate: "Парақшаға h2 тақырыбын қосыңыз",
    availableTags: ["html", "head", "title", "body", "h2"],
    generator: (v) => {
      const fruit = pick(fruits, v);
      return {
        title: `${fruit} туралы h2 бар парақша`,
        description: `"${fruit}" h2 тақырыбы бар қарапайым парақша жасаңыз.`,
        instruction: `"${fruit}" мәтіні бар h2 тақырыбы бар HTML парақша жасаңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Жемістер" }]},
            { tag: "body", children: [{ tag: "h2", content: fruit }] }
          ]}
        ],
        expectedHtml: `<html><head><title>Жемістер</title></head><body><h2>${fruit}</h2></body></html>`,
      };
    },
  })),

  // ===== TOPIC 3: МӘТІНДІ ПІШІМДЕУ (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Мәтінді пішімдеу",
    difficulty: "easy",
    titleTemplate: `Қалың мәтін - Нұсқа ${i + 1}`,
    descriptionTemplate: "Қалың мәтін үшін strong тегін қолданыңыз",
    instructionTemplate: "Мәтінді қалың жасаңыз",
    availableTags: ["html", "head", "title", "body", "p", "strong"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `Қалың есім: ${name}`,
        description: `"${name}" есімі қалың болатын абзац жасаңыз.`,
        instruction: `Абзац жасаңыз: "Менің атым " содан кейін қалың "${name}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Қалың мәтін" }]},
            { tag: "body", children: [
              { tag: "p", content: "Менің атым ", children: [
                { tag: "strong", content: name }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Қалың мәтін</title></head><body><p>Менің атым <strong>${name}</strong></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Мәтінді пішімдеу",
    difficulty: "easy",
    titleTemplate: `Көлбеу мәтін - Нұсқа ${i + 1}`,
    descriptionTemplate: "Көлбеу мәтін үшін em тегін қолданыңыз",
    instructionTemplate: "Мәтінді көлбеу жасаңыз",
    availableTags: ["html", "head", "title", "body", "p", "em"],
    generator: (v) => {
      const city = pick(cities, v);
      return {
        title: `Көлбеу қала: ${city}`,
        description: `"${city}" көлбеу болатын абзац жасаңыз.`,
        instruction: `Жасаңыз: "Мен тұрамын " содан кейін көлбеу "${city}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Қалалар" }]},
            { tag: "body", children: [
              { tag: "p", content: "Мен тұрамын ", children: [
                { tag: "em", content: city }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Қалалар</title></head><body><p>Мен тұрамын <em>${city}</em></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Мәтінді пішімдеу",
    difficulty: "medium",
    titleTemplate: `Аралас пішімдеу - Нұсқа ${i + 1}`,
    descriptionTemplate: "Қалың және көлбеуді біріктіріңіз",
    instructionTemplate: "strong және em қолданыңыз",
    availableTags: ["html", "head", "title", "body", "p", "strong", "em"],
    generator: (v) => {
      const name = pick(names, v);
      const hobby = pick(hobbies, v + 2);
      return {
        title: `${name} үшін пішімделген өмірбаян`,
        description: `Қалың есімі және көлбеу хоббиі бар абзац жасаңыз.`,
        instruction: `Жасаңыз: қалың "${name}" содан кейін " Y-ді ұнатады " содан кейін көлбеу "${hobby}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Өмірбаян" }]},
            { tag: "body", children: [
              { tag: "p", children: [
                { tag: "strong", content: name },
                { tag: "em", content: hobby }
              ], content: " Y-ді ұнатады " }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Өмірбаян</title></head><body><p><strong>${name}</strong> ${hobby}-ді ұнатады <em>${hobby}</em></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Мәтінді пішімдеу",
    difficulty: "hard",
    titleTemplate: `Толық пішімделген мақала - Нұсқа ${i + 1}`,
    descriptionTemplate: "Пішімделген мақала жасаңыз",
    instructionTemplate: "Бірнеше мәтін пішімдеу тегтерін қолданыңыз",
    availableTags: ["html", "head", "title", "body", "h1", "p", "strong", "em", "u"],
    generator: (v) => {
      const subj = pick(subjects, v);
      return {
        title: `Пішімделген ${subj} мақаласы`,
        description: `Тақырыбы, қалың, көлбеу және асты сызылған мәтіні бар абзацтары бар парақша жасаңыз.`,
        instruction: `Жасаңыз: h1 "${subj}", қалың кілт сөзі бар абзац, көлбеу және асты сызылған абзац.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: subj }]},
            { tag: "body", children: [
              { tag: "h1", content: subj },
              { tag: "p", children: [{ tag: "strong", content: subj }], content: " - маңызды пән." },
              { tag: "p", children: [
                { tag: "em", content: "Оқу" },
                { tag: "u", content: "күн сайын" }
              ], content: " тырысып " }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${subj}</title></head><body><h1>${subj}</h1><p><strong>${subj}</strong> - маңызды пән.</p><p><em>Оқу</em> тырысып <u>күн сайын</u></p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 4: СІЛТЕМЕЛЕР (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Сілтемелер",
    difficulty: "easy",
    titleTemplate: `Қарапайым сілтеме - Нұсқа ${i + 1}`,
    descriptionTemplate: "Гиперсілтеме жасаңыз",
    instructionTemplate: "Парақшаңызға сілтеме қосыңыз",
    availableTags: ["html", "head", "title", "body", "a"],
    generator: (v) => {
      const city = pick(cities, v);
      return {
        title: `${city} парақшасына сілтеме`,
        description: `"#${city.toLowerCase()}" адресіне бағытталған "${city}-ге бару" деген сілтеме жасаңыз.`,
        instruction: `"${city}-ге бару" мәтіні және "#${city.toLowerCase()}" href атрибуты бар якорь тегін қосыңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Сілтемелер" }]},
            { tag: "body", children: [
              { tag: "a", content: `${city}-ге бару`, attributes: { href: `#${city.toLowerCase()}` } }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Сілтемелер</title></head><body><a href="#${city.toLowerCase()}">${city}-ге бару</a></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Сілтемелер",
    difficulty: "medium",
    titleTemplate: `Бірнеше сілтеме - Нұсқа ${i + 1}`,
    descriptionTemplate: "Сілтемелері бар навигация жасаңыз",
    instructionTemplate: "Бірнеше сілтемесі бар парақша жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "p", "a"],
    generator: (v) => {
      const subj1 = pick(subjects, v);
      const subj2 = pick(subjects, v + 3);
      return {
        title: `${subj1} және ${subj2} навигациясы`,
        description: `Тақырыбы және әр түрлі пәндерге екі сілтемесі бар парақша жасаңыз.`,
        instruction: `Жасаңыз: h1 "Пәндер", содан кейін әрқайсысында сілтемесі бар екі абзац.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Пәндер" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Пәндер" },
              { tag: "p", children: [{ tag: "a", content: subj1, attributes: { href: `#${subj1.toLowerCase()}` } }] },
              { tag: "p", children: [{ tag: "a", content: subj2, attributes: { href: `#${subj2.toLowerCase()}` } }] }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Пәндер</title></head><body><h1>Пәндер</h1><p><a href="#${subj1.toLowerCase()}">${subj1}</a></p><p><a href="#${subj2.toLowerCase()}">${subj2}</a></p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Сілтемелер",
    difficulty: "hard",
    titleTemplate: `Пішімделген сілтемелер - Нұсқа ${i + 1}`,
    descriptionTemplate: "Сілтемелерді мәтін пішімдеумен біріктіріңіз",
    instructionTemplate: "Пішімделген сілтемелері бар парақша жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "p", "a", "strong"],
    generator: (v) => {
      const name = pick(names, v);
      const hobby = pick(hobbies, v + 1);
      return {
        title: `Сілтемелері бар ${name} портфолиосы`,
        description: `Қалың тақырыбы, қалың сілтемесі бар абзац жасаңыз.`,
        instruction: `h1 "${name} портфолиосы" жасаңыз, "${hobby}"-ге қалың сілтемесі бар абзац.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name} портфолиосы` }]},
            { tag: "body", children: [
              { tag: "h1", content: `${name} портфолиосы` },
              { tag: "p", content: "Менің ", children: [
                { tag: "a", attributes: { href: `#${hobby}` }, children: [
                  { tag: "strong", content: hobby }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name} портфолиосы</title></head><body><h1>${name} портфолиосы</h1><p>Менің <a href="#${hobby}"><strong>${hobby}</strong></a></p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 5: СУРЕТТЕР (40 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Суреттер",
    difficulty: "easy",
    titleTemplate: `Жалғыз сурет - Нұсқа ${i + 1}`,
    descriptionTemplate: "Парақшаға сурет қосыңыз",
    instructionTemplate: "Alt мәтіні бар сурет қосыңыз",
    availableTags: ["html", "head", "title", "body", "img"],
    generator: (v) => {
      const animal = pick(animals, v);
      return {
        title: `${animal} суреті`,
        description: `Дұрыс alt мәтіні бар ${animal} суретін қосыңыз.`,
        instruction: `src "${animal}.jpg" және alt "${animal}" атрибуттары бар img тегін қосыңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Суреттер" }]},
            { tag: "body", children: [
              { tag: "img", attributes: { src: `${animal}.jpg`, alt: `${animal}` } }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Суреттер</title></head><body><img src="${animal}.jpg" alt="${animal}"></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Суреттер",
    difficulty: "medium",
    titleTemplate: `Сипаттамасы бар сурет - Нұсқа ${i + 1}`,
    descriptionTemplate: "Тақырыбы және абзацы бар сурет қосыңыз",
    instructionTemplate: "Галерея элементін жасаңыз",
    availableTags: ["html", "head", "title", "body", "h2", "img", "p"],
    generator: (v) => {
      const fruit = pick(fruits, v);
      return {
        title: `${fruit} галерея элементі`,
        description: `h2 тақырыбы, суреті және сипаттама абзацы бар парақша жасаңыз.`,
        instruction: `h2 "${fruit}", img src="${fruit}.jpg" alt="${fruit}", p "Дәмді ${fruit}."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Галерея" }]},
            { tag: "body", children: [
              { tag: "h2", content: fruit },
              { tag: "img", attributes: { src: `${fruit}.jpg`, alt: fruit } },
              { tag: "p", content: `Дәмді ${fruit}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Галерея</title></head><body><h2>${fruit}</h2><img src="${fruit}.jpg" alt="${fruit}"><p>Дәмді ${fruit}.</p></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 10 }, (_, i): TaskTemplate => ({
    topic: "Суреттер",
    difficulty: "hard",
    titleTemplate: `Сурет галереясы - Нұсқа ${i + 1}`,
    descriptionTemplate: "Бірнеше суреті бар галерея жасаңыз",
    instructionTemplate: "Бірнеше суреті бар галерея жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "img", "p"],
    generator: (v) => {
      const a1 = pick(animals, v);
      const a2 = pick(animals, v + 3);
      return {
        title: `Жануарлар галереясы: ${a1} және ${a2}`,
        description: `Екі суреті және сипаттамасы бар галерея парақшасын жасаңыз.`,
        instruction: `h1 "Жануарлар галереясы", содан кейін әрқайсысы үшін: h2 аты, img, p сипаттамасы.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Жануарлар галереясы" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Жануарлар галереясы" },
              { tag: "h2", content: a1 },
              { tag: "img", attributes: { src: `${a1}.jpg`, alt: a1 } },
              { tag: "p", content: `Бұл ${a1}.` },
              { tag: "h2", content: a2 },
              { tag: "img", attributes: { src: `${a2}.jpg`, alt: a2 } },
              { tag: "p", content: `Бұл ${a2}.` }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Жануарлар галереясы</title></head><body><h1>Жануарлар галереясы</h1><h2>${a1}</h2><img src="${a1}.jpg" alt="${a1}"><p>Бұл ${a1}.</p><h2>${a2}</h2><img src="${a2}.jpg" alt="${a2}"><p>Бұл ${a2}.</p></body></html>`,
      };
    },
  })),

  // ===== TOPIC 6: ТІЗІМДЕР (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тізімдер",
    difficulty: "easy",
    titleTemplate: `Реттелмеген тізім - Нұсқа ${i + 1}`,
    descriptionTemplate: "Реттелмеген тізім жасаңыз",
    instructionTemplate: "Таңбалы тізім жасаңыз",
    availableTags: ["html", "head", "title", "body", "h2", "ul", "li"],
    generator: (v) => {
      const f1 = pick(fruits, v);
      const f2 = pick(fruits, v + 2);
      const f3 = pick(fruits, v + 5);
      return {
        title: `Жемістер тізімі: ${f1}, ${f2}, ${f3}`,
        description: `Үш жемісі бар реттелмеген тізім жасаңыз.`,
        instruction: `Жасаңыз: h2 "Жемістер", содан кейін ul үш li элементімен: "${f1}", "${f2}", "${f3}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Жемістер" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Жемістер" },
              { tag: "ul", children: [
                { tag: "li", content: f1 },
                { tag: "li", content: f2 },
                { tag: "li", content: f3 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Жемістер</title></head><body><h2>Жемістер</h2><ul><li>${f1}</li><li>${f2}</li><li>${f3}</li></ul></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тізімдер",
    difficulty: "easy",
    titleTemplate: `Реттелген тізім - Нұсқа ${i + 1}`,
    descriptionTemplate: "Реттелген тізім жасаңыз",
    instructionTemplate: "Нөмірленген тізім жасаңыз",
    availableTags: ["html", "head", "title", "body", "h2", "ol", "li"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      const s3 = pick(subjects, v + 4);
      return {
        title: `Сүйікті пәндер: ${s1}, ${s2}, ${s3}`,
        description: `Сүйікті пәндердің реттелген тізімін жасаңыз.`,
        instruction: `Жасаңыз: h2 "Менің сүйікті пәндерім", содан кейін ol "${s1}", "${s2}", "${s3}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Пәндер" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Менің сүйікті пәндерім" },
              { tag: "ol", children: [
                { tag: "li", content: s1 },
                { tag: "li", content: s2 },
                { tag: "li", content: s3 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Пәндер</title></head><body><h2>Менің сүйікті пәндерім</h2><ol><li>${s1}</li><li>${s2}</li><li>${s3}</li></ol></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тізімдер",
    difficulty: "medium",
    titleTemplate: `Аралас тізімдер - Нұсқа ${i + 1}`,
    descriptionTemplate: "Реттелген және реттелмеген тізімдерді біріктіріңіз",
    instructionTemplate: "Екі түрлі тізім жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "h2", "ul", "ol", "li"],
    generator: (v) => {
      const h1 = pick(hobbies, v);
      const h2 = pick(hobbies, v + 3);
      const f1 = pick(foods, v);
      const f2 = pick(foods, v + 2);
      return {
        title: `Хобби және тағамдар тізімдері`,
        description: `Хоббидің реттелген тізімі және тағамдардың реттелмеген тізімі бар парақша жасаңыз.`,
        instruction: `h1 "Менің тізімдерім", h2 "Хобби" ol-мен, h2 "Тағамдар" ul-мен.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Менің тізімдерім" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Менің тізімдерім" },
              { tag: "h2", content: "Хобби" },
              { tag: "ol", children: [
                { tag: "li", content: h1 },
                { tag: "li", content: h2 }
              ]},
              { tag: "h2", content: "Тағамдар" },
              { tag: "ul", children: [
                { tag: "li", content: f1 },
                { tag: "li", content: f2 }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Менің тізімдерім</title></head><body><h1>Менің тізімдерім</h1><h2>Хобби</h2><ol><li>${h1}</li><li>${h2}</li></ol><h2>Тағамдар</h2><ul><li>${f1}</li><li>${f2}</li></ul></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Тізімдер",
    difficulty: "hard",
    titleTemplate: `Кірістірілген тізім - Нұсқа ${i + 1}`,
    descriptionTemplate: "Кірістірілген тізімдер жасаңыз",
    instructionTemplate: "Ішкі элементтері бар тізім жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "ul", "ol", "li"],
    generator: (v) => {
      const s = pick(subjects, v);
      const t1 = pick(hobbies, v);
      const t2 = pick(hobbies, v + 3);
      return {
        title: `${s} үшін кірістірілген тізім`,
        description: `Кірістірілген ішкі элементтері бар тізім жасаңыз.`,
        instruction: `h1 "${s}", ul ішінде li "${s}" кірістірілген ol-мен "${t1}" және "${t2}".`,
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

  // ===== TOPIC 7: КЕСТЕЛЕР (60 tasks) =====
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Кестелер",
    difficulty: "easy",
    titleTemplate: `Қарапайым кесте - Нұсқа ${i + 1}`,
    descriptionTemplate: "Негізгі кесте жасаңыз",
    instructionTemplate: "Жолдары бар кесте жасаңыз",
    availableTags: ["html", "head", "title", "body", "h2", "table", "tr", "th", "td"],
    generator: (v) => {
      const n = pick(names, v);
      const c = pick(cities, v);
      return {
        title: `${n} үшін оқушы ақпарат кестесі`,
        description: `Аты және Қаласы бағандары бар кесте жасаңыз.`,
        instruction: `Тақырып жолы (th: "Аты", "Қала") және деректер жолы (td: "${n}", "${c}") бар кесте жасаңыз.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Оқушылар" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Оқушылар" },
              { tag: "table", children: [
                { tag: "tr", children: [
                  { tag: "th", content: "Аты" },
                  { tag: "th", content: "Қала" }
                ]},
                { tag: "tr", children: [
                  { tag: "td", content: n },
                  { tag: "td", content: c }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Оқушылар</title></head><body><h2>Оқушылар</h2><table><tr><th>Аты</th><th>Қала</th></tr><tr><td>${n}</td><td>${c}</td></tr></table></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Кестелер",
    difficulty: "medium",
    titleTemplate: `Көп жолды кесте - Нұсқа ${i + 1}`,
    descriptionTemplate: "Бірнеше жолы бар кесте жасаңыз",
    instructionTemplate: "Бірнеше деректер жолы бар кесте жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "table", "tr", "th", "td"],
    generator: (v) => {
      const n1 = pick(names, v);
      const n2 = pick(names, v + 3);
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      return {
        title: `${n1} және ${n2} кесте кестесі`,
        description: `Оқушы және Пән бағандары мен екі деректер жолы бар кесте жасаңыз.`,
        instruction: `h1 "Сабақ кестесі", кесте тақырыбы: "Оқушы", "Пән"; 1-жол: "${n1}", "${s1}"; 2-жол: "${n2}", "${s2}".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Кесте" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Сабақ кестесі" },
              { tag: "table", children: [
                { tag: "tr", children: [{ tag: "th", content: "Оқушы" }, { tag: "th", content: "Пән" }]},
                { tag: "tr", children: [{ tag: "td", content: n1 }, { tag: "td", content: s1 }]},
                { tag: "tr", children: [{ tag: "td", content: n2 }, { tag: "td", content: s2 }]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Кесте</title></head><body><h1>Сабақ кестесі</h1><table><tr><th>Оқушы</th><th>Пән</th></tr><tr><td>${n1}</td><td>${s1}</td></tr><tr><td>${n2}</td><td>${s2}</td></tr></table></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Кестелер",
    difficulty: "hard",
    titleTemplate: `Күрделі кесте - Нұсқа ${i + 1}`,
    descriptionTemplate: "3 баған және 3 жолы бар кесте жасаңыз",
    instructionTemplate: "Толық деректер кестесін жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "table", "tr", "th", "td"],
    generator: (v) => {
      const n1 = pick(names, v);
      const n2 = pick(names, v + 2);
      const n3 = pick(names, v + 4);
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 1);
      const s3 = pick(subjects, v + 3);
      return {
        title: `Үш оқушы үшін баға кестесі`,
        description: `Оқушы, Пән, Баға бағандары және үш деректер жолы бар кесте жасаңыз.`,
        instruction: `h1 "Бағалар", 3 бағаны және 3 деректер жолы бар кесте.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Бағалар" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Бағалар" },
              { tag: "table", children: [
                { tag: "tr", children: [{ tag: "th", content: "Оқушы" }, { tag: "th", content: "Пән" }, { tag: "th", content: "Баға" }]},
                { tag: "tr", children: [{ tag: "td", content: n1 }, { tag: "td", content: s1 }, { tag: "td", content: "90" }]},
                { tag: "tr", children: [{ tag: "td", content: n2 }, { tag: "td", content: s2 }, { tag: "td", content: "85" }]},
                { tag: "tr", children: [{ tag: "td", content: n3 }, { tag: "td", content: s3 }, { tag: "td", content: "92" }]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Бағалар</title></head><body><h1>Бағалар</h1><table><tr><th>Оқушы</th><th>Пән</th><th>Баға</th></tr><tr><td>${n1}</td><td>${s1}</td><td>90</td></tr><tr><td>${n2}</td><td>${s2}</td><td>85</td></tr><tr><td>${n3}</td><td>${s3}</td><td>92</td></tr></table></body></html>`,
      };
    },
  })),

  // ===== TOPIC 8: ФОРМАЛАР (60 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Формалар",
    difficulty: "easy",
    titleTemplate: `Қарапайым енгізу - Нұсқа ${i + 1}`,
    descriptionTemplate: "Енгізу өрісі бар форма жасаңыз",
    instructionTemplate: "Негізгі форма жасаңыз",
    availableTags: ["html", "head", "title", "body", "h2", "form", "label", "input", "button"],
    generator: (v) => {
      const field = pick(["Аты", "Email", "Телефон", "Мекенжай", "Қала", "Жасы", "Мектеп", "Ел", "Құпия сөз", "Пайдаланушы аты"], v);
      return {
        title: `${field} енгізу өрісі бар форма`,
        description: `Белгіленген ${field} енгізу өрісі және жіберу батырмасы бар форма жасаңыз.`,
        instruction: `Жасаңыз: h2 "Тіркелу", форма label "${field}:", input, және button "Жіберу".`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Форма" }]},
            { tag: "body", children: [
              { tag: "h2", content: "Тіркелу" },
              { tag: "form", children: [
                { tag: "label", content: `${field}:` },
                { tag: "input", attributes: { type: "text" } },
                { tag: "button", content: "Жіберу" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Форма</title></head><body><h2>Тіркелу</h2><form><label>${field}:</label><input type="text"><button>Жіберу</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Формалар",
    difficulty: "medium",
    titleTemplate: `Көп өрісті форма - Нұсқа ${i + 1}`,
    descriptionTemplate: "Бірнеше енгізу өрісі бар форма жасаңыз",
    instructionTemplate: "Бірнеше өрісі бар форма жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "button"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `${name} үшін тіркелу формасы`,
        description: `Аты, Email өрістері және Жіберу батырмасы бар форма жасаңыз.`,
        instruction: `h1 "Тіркелу", форма екі белгіленген енгізу өрісімен (Аты, Email) және Тіркелу батырмасымен.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Тіркелу" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Тіркелу" },
              { tag: "form", children: [
                { tag: "label", content: "Аты:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Email:" },
                { tag: "input", attributes: { type: "email" } },
                { tag: "button", content: "Тіркелу" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Тіркелу</title></head><body><h1>Тіркелу</h1><form><label>Аты:</label><input type="text"><label>Email:</label><input type="email"><button>Тіркелу</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Формалар",
    difficulty: "hard",
    titleTemplate: `Таңдау формасы - Нұсқа ${i + 1}`,
    descriptionTemplate: "Таңдау тізімі бар форма жасаңыз",
    instructionTemplate: "Select элементі бар форма жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "select", "option", "button"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 2);
      const s3 = pick(subjects, v + 5);
      return {
        title: `Пән таңдау формасы`,
        description: `Есім енгізу өрісі және пән таңдау тізімі бар форма жасаңыз.`,
        instruction: `h1 "Қабылдау", форма есім енгізу өрісімен, таңдау тізімімен: "${s1}", "${s2}", "${s3}", және Жіберу батырмасымен.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Қабылдау" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Қабылдау" },
              { tag: "form", children: [
                { tag: "label", content: "Аты:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Пән:" },
                { tag: "select", children: [
                  { tag: "option", content: s1 },
                  { tag: "option", content: s2 },
                  { tag: "option", content: s3 }
                ]},
                { tag: "button", content: "Қабылдау" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Қабылдау</title></head><body><h1>Қабылдау</h1><form><label>Аты:</label><input type="text"><label>Пән:</label><select><option>${s1}</option><option>${s2}</option><option>${s3}</option></select><button>Қабылдау</button></form></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Формалар",
    difficulty: "hard",
    titleTemplate: `Textarea формасы - Нұсқа ${i + 1}`,
    descriptionTemplate: "Textarea бар форма жасаңыз",
    instructionTemplate: "Кері байланыс формасын жасаңыз",
    availableTags: ["html", "head", "title", "body", "h1", "form", "label", "input", "textarea", "button"],
    generator: (v) => {
      const subj = pick(subjects, v);
      return {
        title: `${subj} кері байланыс формасы`,
        description: `Есім енгізу өрісі, кері байланыс textarea және жіберу батырмасы бар форма жасаңыз.`,
        instruction: `h1 "${subj} кері байланыс", форма "Аты" енгізу өрісімен, "Пікірлер" textarea және "Жіберу" батырмасымен.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Кері байланыс" }]},
            { tag: "body", children: [
              { tag: "h1", content: `${subj} кері байланыс` },
              { tag: "form", children: [
                { tag: "label", content: "Аты:" },
                { tag: "input", attributes: { type: "text" } },
                { tag: "label", content: "Пікірлер:" },
                { tag: "textarea", content: "" },
                { tag: "button", content: "Жіберу" }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Кері байланыс</title></head><body><h1>${subj} кері байланыс</h1><form><label>Аты:</label><input type="text"><label>Пікірлер:</label><textarea></textarea><button>Жіберу</button></form></body></html>`,
      };
    },
  })),

  // ===== TOPIC 9: СЕМАНТИКАЛЫҚ HTML (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Семантикалық HTML",
    difficulty: "medium",
    titleTemplate: `Семантикалық құрылым - Нұсқа ${i + 1}`,
    descriptionTemplate: "Семантикалық HTML элементтерін қолданыңыз",
    instructionTemplate: "Семантикалық тегтері бар парақша жасаңыз",
    availableTags: ["html", "head", "title", "body", "header", "main", "footer", "h1", "p"],
    generator: (v) => {
      const name = pick(names, v);
      return {
        title: `${name} үшін семантикалық парақша`,
        description: `header, main және footer элементтерін қолданып парақша жасаңыз.`,
        instruction: `Жасаңыз: header ішінде h1 "${name} сайты", main ішінде абзац, footer ішінде авторлық құқық.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name} сайты` }]},
            { tag: "body", children: [
              { tag: "header", children: [{ tag: "h1", content: `${name} сайты` }] },
              { tag: "main", children: [{ tag: "p", content: `${name} веб-сайтына қош келдіңіз.` }] },
              { tag: "footer", children: [{ tag: "p", content: `© 2026 ${name}` }] }
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name} сайты</title></head><body><header><h1>${name} сайты</h1></header><main><p>${name} веб-сайтына қош келдіңіз.</p></main><footer><p>© 2026 ${name}</p></footer></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Семантикалық HTML",
    difficulty: "medium",
    titleTemplate: `Nav және бөлімдер - Нұсқа ${i + 1}`,
    descriptionTemplate: "nav және section элементтерін қолданыңыз",
    instructionTemplate: "Навигация және бөлімдер жасаңыз",
    availableTags: ["html", "head", "title", "body", "header", "nav", "section", "h1", "h2", "p", "a"],
    generator: (v) => {
      const s1 = pick(subjects, v);
      const s2 = pick(subjects, v + 3);
      return {
        title: `Nav бар парақша: ${s1}, ${s2}`,
        description: `Навигациясы және екі бөлімі бар парақша жасаңыз.`,
        instruction: `header ішінде nav (екі сілтеме), "${s1}" бөлімі және "${s2}" бөлімі.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Мектеп" }]},
            { tag: "body", children: [
              { tag: "header", children: [
                { tag: "nav", children: [
                  { tag: "a", content: s1, attributes: { href: `#${s1.toLowerCase()}` } },
                  { tag: "a", content: s2, attributes: { href: `#${s2.toLowerCase()}` } }
                ]}
              ]},
              { tag: "section", children: [
                { tag: "h2", content: s1 },
                { tag: "p", content: `${s1} туралы үйреніңіз.` }
              ]},
              { tag: "section", children: [
                { tag: "h2", content: s2 },
                { tag: "p", content: `${s2} туралы үйреніңіз.` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Мектеп</title></head><body><header><nav><a href="#${s1.toLowerCase()}">${s1}</a><a href="#${s2.toLowerCase()}">${s2}</a></nav></header><section><h2>${s1}</h2><p>${s1} туралы үйреніңіз.</p></section><section><h2>${s2}</h2><p>${s2} туралы үйреніңіз.</p></section></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Семантикалық HTML",
    difficulty: "hard",
    titleTemplate: `Толық семантикалық парақша - Нұсқа ${i + 1}`,
    descriptionTemplate: "Толық семантикалық парақша жасаңыз",
    instructionTemplate: "Барлық семантикалық элементтерді қолданыңыз",
    availableTags: ["html", "head", "title", "body", "header", "nav", "main", "article", "aside", "footer", "h1", "h2", "p", "a"],
    generator: (v) => {
      const name = pick(names, v);
      const subj = pick(subjects, v);
      return {
        title: `${name} толық семантикалық парақшасы`,
        description: `header, nav, main, article, aside және footer бар толық семантикалық парақша жасаңыз.`,
        instruction: `Толық парақша құрылымын жасаңыз: header ішінде h1 және nav, main ішінде ${subj} туралы article және кеңесі бар aside, footer ішінде авторлық құқық.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: `${name} блогы` }]},
            { tag: "body", children: [
              { tag: "header", children: [
                { tag: "h1", content: `${name} блогы` },
                { tag: "nav", children: [
                  { tag: "a", content: "Басты бет", attributes: { href: "#home" } },
                  { tag: "a", content: "Біз туралы", attributes: { href: "#about" } }
                ]}
              ]},
              { tag: "main", children: [
                { tag: "article", children: [
                  { tag: "h2", content: subj },
                  { tag: "p", content: `Бүгін біз ${subj} туралы үйренеміз.` }
                ]},
                { tag: "aside", children: [
                  { tag: "p", content: "Кеңес: Күн сайын жаттығыңыз!" }
                ]}
              ]},
              { tag: "footer", children: [
                { tag: "p", content: `© 2026 ${name}` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>${name} блогы</title></head><body><header><h1>${name} блогы</h1><nav><a href="#home">Басты бет</a><a href="#about">Біз туралы</a></nav></header><main><article><h2>${subj}</h2><p>Бүгін біз ${subj} туралы үйренеміз.</p></article><aside><p>Кеңес: Күн сайын жаттығыңыз!</p></aside></main><footer><p>© 2026 ${name}</p></footer></body></html>`,
      };
    },
  })),

  // ===== TOPIC 10: DIV ЖӘНЕ SPAN (50 tasks) =====
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Div және Span",
    difficulty: "easy",
    titleTemplate: `Div контейнер - Нұсқа ${i + 1}`,
    descriptionTemplate: "Div-ті контейнер ретінде қолданыңыз",
    instructionTemplate: "Мазмұнды div-ке орауыңыз",
    availableTags: ["html", "head", "title", "body", "div", "h2", "p"],
    generator: (v) => {
      const color = pick(colors, v);
      return {
        title: `Div контейнер - ${color} тақырып`,
        description: `Мазмұны div-ке оралған парақша жасаңыз.`,
        instruction: `Жасаңыз: div ішінде h2 "Бөлім" және p "Бұл ${color} бөлімі."`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Div-тер" }]},
            { tag: "body", children: [
              { tag: "div", children: [
                { tag: "h2", content: "Бөлім" },
                { tag: "p", content: `Бұл ${color} бөлімі.` }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Div-тер</title></head><body><div><h2>Бөлім</h2><p>Бұл ${color} бөлімі.</p></div></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 15 }, (_, i): TaskTemplate => ({
    topic: "Div және Span",
    difficulty: "medium",
    titleTemplate: `Бірнеше div - Нұсқа ${i + 1}`,
    descriptionTemplate: "Көп div-ті орналасу жасаңыз",
    instructionTemplate: "Бірнеше div бөлімдерін жасаңыз",
    availableTags: ["html", "head", "title", "body", "div", "h1", "h2", "p", "span"],
    generator: (v) => {
      const c1 = pick(colors, v);
      const c2 = pick(colors, v + 3);
      return {
        title: `Екі бөлімді орналасу: ${c1} және ${c2}`,
        description: `Екі div бөлімі бар парақша жасаңыз.`,
        instruction: `h1 "Орналасу", div ішінде h2 "${c1} бөлімі" және p, div ішінде h2 "${c2} бөлімі" және span бар p.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Орналасу" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Орналасу" },
              { tag: "div", children: [
                { tag: "h2", content: `${c1} бөлімі` },
                { tag: "p", content: `Бұл ${c1} аймағы.` }
              ]},
              { tag: "div", children: [
                { tag: "h2", content: `${c2} бөлімі` },
                { tag: "p", content: "Ерекшеленген: ", children: [
                  { tag: "span", content: c2 }
                ]}
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Орналасу</title></head><body><h1>Орналасу</h1><div><h2>${c1} бөлімі</h2><p>Бұл ${c1} аймағы.</p></div><div><h2>${c2} бөлімі</h2><p>Ерекшеленген: <span>${c2}</span></p></div></body></html>`,
      };
    },
  })),
  ...Array.from({ length: 20 }, (_, i): TaskTemplate => ({
    topic: "Div және Span",
    difficulty: "hard",
    titleTemplate: `Карточка орналасуы - Нұсқа ${i + 1}`,
    descriptionTemplate: "Карточкалы орналасу жасаңыз",
    instructionTemplate: "Div-термен карточка компоненттерін жасаңыз",
    availableTags: ["html", "head", "title", "body", "div", "h1", "h3", "p", "img", "a"],
    generator: (v) => {
      const a1 = pick(animals, v);
      const a2 = pick(animals, v + 4);
      return {
        title: `Жануар карточкалары: ${a1} және ${a2}`,
        description: `Екі жануар карточкасы бар орналасу жасаңыз.`,
        instruction: `h1 "Жануарлар", екі div әрқайсысында h3, img, p және сілтеме.`,
        expectedBlocks: [
          { tag: "html", children: [
            { tag: "head", children: [{ tag: "title", content: "Жануарлар" }]},
            { tag: "body", children: [
              { tag: "h1", content: "Жануарлар" },
              { tag: "div", children: [
                { tag: "h3", content: a1 },
                { tag: "img", attributes: { src: `${a1}.jpg`, alt: a1 } },
                { tag: "p", content: `${a1} таңғажайып.` },
                { tag: "a", content: "Толығырақ", attributes: { href: `#${a1}` } }
              ]},
              { tag: "div", children: [
                { tag: "h3", content: a2 },
                { tag: "img", attributes: { src: `${a2}.jpg`, alt: a2 } },
                { tag: "p", content: `${a2} керемет.` },
                { tag: "a", content: "Толығырақ", attributes: { href: `#${a2}` } }
              ]}
            ]}
          ]}
        ],
        expectedHtml: `<html><head><title>Жануарлар</title></head><body><h1>Жануарлар</h1><div><h3>${a1}</h3><img src="${a1}.jpg" alt="${a1}"><p>${a1} таңғажайып.</p><a href="#${a1}">Толығырақ</a></div><div><h3>${a2}</h3><img src="${a2}.jpg" alt="${a2}"><p>${a2} керемет.</p><a href="#${a2}">Толығырақ</a></div></body></html>`,
      };
    },
  })),
];
