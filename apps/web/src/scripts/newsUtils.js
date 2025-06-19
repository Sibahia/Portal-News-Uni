// Configuración de la API
const API_BASE_URL = "http://localhost:3000"

// Datos mock para desarrollo
export const mockNewsData = [
  {
    id: "1",
    autor: "María González",
    title: "Avances revolucionarios en inteligencia artificial transforman la industria tecnológica",
    content:
      "Las últimas innovaciones en IA están redefiniendo cómo las empresas abordan los desafíos tecnológicos, prometiendo cambios significativos en múltiples sectores industriales. Los algoritmos de aprendizaje automático están revolucionando desde la medicina hasta las finanzas.",
    image: "/images/ai-technology.jpg",
    time_created: "2024-01-15T10:30:00Z",
    category: "Tecnología",
    views: "12.5K",
    likes: "324",
    comments: "89",
  },
  {
    id: "2",
    autor: "Carlos Ruiz",
    title: "Mundial de Fútbol: Resultados sorprendentes en los cuartos de final",
    content:
      "Los equipos favoritos enfrentan desafíos inesperados en esta fase crucial del torneo. Las sorpresas no han dejado de aparecer en esta edición del mundial.",
    image: "/images/football-stadium.jpg",
    time_created: "2024-01-15T06:45:00Z",
    category: "Deportes",
    views: "8.2K",
    likes: "156",
    comments: "43",
  },
  {
    id: "3",
    autor: "Ana López",
    title: "Nueva propuesta legislativa genera debate en el congreso",
    content:
      "La propuesta ha dividido opiniones entre los legisladores, generando intensos debates sobre su implementación y posibles consecuencias.",
    image: "/images/government-building.jpg",
    time_created: "2024-01-15T04:20:00Z",
    category: "Política",
    views: "5.7K",
    likes: "89",
    comments: "67",
  },
  {
    id: "4",
    autor: "Roberto Silva",
    title: "Festival Internacional de Cine anuncia su programación completa",
    content:
      "Más de 200 películas de 50 países diferentes se presentarán en esta edición que promete ser histórica. Directores reconocidos mundialmente participarán.",
    image: "/images/cinema-festival.jpg",
    time_created: "2024-01-14T20:15:00Z",
    category: "Cultura",
    views: "3.4K",
    likes: "234",
    comments: "12",
  },
  {
    id: "5",
    autor: "Luis Martín",
    title: "Mercados financieros muestran tendencia alcista",
    content:
      "Los principales índices bursátiles registran ganancias significativas impulsados por resultados corporativos positivos.",
    image: "/images/stock-market.jpg",
    time_created: "2024-01-14T16:30:00Z",
    category: "Economía",
    views: "6.8K",
    likes: "145",
    comments: "28",
  },
  {
    id: "6",
    autor: "Dra. Elena Vega",
    title: "Descubrimiento científico podría revolucionar la medicina moderna",
    content:
      "Investigadores logran un avance significativo que podría cambiar el tratamiento de enfermedades crónicas y mejorar la calidad de vida de millones.",
    image: "/images/medical-research.jpg",
    time_created: "2024-01-13T14:45:00Z",
    category: "Ciencia",
    views: "9.1K",
    likes: "456",
    comments: "78",
  },
  {
    id: "7",
    autor: "Tech News",
    title: "Nueva actualización de seguridad protege millones de dispositivos",
    content:
      "La actualización incluye parches críticos que protegen contra las últimas amenazas cibernéticas identificadas.",
    image: "/images/cybersecurity.jpg",
    time_created: "2024-01-12T11:20:00Z",
    category: "Tecnología",
    views: "4.2K",
    likes: "98",
    comments: "15",
  },
  {
    id: "8",
    autor: "Social Impact",
    title: "Iniciativa comunitaria transforma barrios urbanos",
    content:
      "El proyecto ha logrado revitalizar espacios públicos y crear oportunidades de empleo para residentes locales.",
    image: "/images/community-garden.jpg",
    time_created: "2024-01-11T09:10:00Z",
    category: "Sociedad",
    views: "2.8K",
    likes: "167",
    comments: "34",
  },
  {
    id: "9",
    autor: "Edu Today",
    title: "Programa educativo digital alcanza récord de participación",
    content:
      "La plataforma ha registrado más de un millón de estudiantes activos, superando todas las expectativas iniciales.",
    image: "/images/online-education.jpg",
    time_created: "2024-01-10T15:30:00Z",
    category: "Educación",
    views: "7.5K",
    likes: "289",
    comments: "56",
  },
]

// Utilidades
export function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Hace menos de 1 hora"
  if (diffInHours < 24) return `Hace ${diffInHours} horas`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "Hace 1 día"
  if (diffInDays < 7) return `Hace ${diffInDays} días`

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getCategoryClass(category) {
  const categoryMap = {
    Tecnología: "bg-red-600",
    Deportes: "bg-green-600",
    Política: "bg-blue-600",
    Cultura: "bg-purple-600",
    Economía: "bg-yellow-600",
    Ciencia: "bg-teal-600",
    Sociedad: "bg-pink-600",
    Educación: "bg-indigo-600",
  }
  return categoryMap[category] || "bg-gray-600"
}

export function getCategoryHoverClass(category) {
  const categoryMap = {
    Tecnología: "group-hover:text-red-600",
    Deportes: "group-hover:text-green-600",
    Política: "group-hover:text-blue-600",
    Cultura: "group-hover:text-purple-600",
    Economía: "group-hover:text-yellow-600",
    Ciencia: "group-hover:text-teal-600",
    Sociedad: "group-hover:text-pink-600",
    Educación: "group-hover:text-indigo-600",
  }
  return categoryMap[category] || "group-hover:text-gray-600"
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

// Función para crear el HTML de una noticia principal
export function createMainArticleHTML(article) {
  const categoryClass = getCategoryClass(article.category)
  const timeAgo = formatTimeAgo(article.time_created)

  return `
        <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-3 md:row-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-full min-h-[300px] md:min-h-[400px]">
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span class="inline-block px-3 py-1 text-xs font-semibold ${categoryClass} text-white rounded-full mb-3">${article.category}</span>
                    <h2 class="text-2xl md:text-3xl font-bold mb-3 leading-tight">${article.title}</h2>
                    <p class="text-gray-200 mb-4 line-clamp-3">${truncateText(article.content, 150)}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-300">
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-user w-4 h-4"></i>
                            <span>${article.autor}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-clock w-4 h-4"></i>
                            <span>${timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `
}

// Función para crear el HTML de una noticia secundaria
export function createSecondaryArticleHTML(article, size = "large") {
  const categoryClass = getCategoryClass(article.category)
  const hoverClass = getCategoryHoverClass(article.category)
  const timeAgo = formatTimeAgo(article.time_created)

  if (size === "small") {
    return `
            <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="relative h-32">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 px-2 py-1 text-xs font-semibold ${categoryClass} text-white rounded-full">${article.category}</span>
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-sm mb-2 line-clamp-3 transition-colors duration-300 ${hoverClass}">${article.title}</h3>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </a>
        `
  }

  return `
        <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-48">
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 px-3 py-1 text-xs font-semibold ${categoryClass} text-white rounded-full">${article.category}</span>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300 ${hoverClass}">${article.title}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${truncateText(article.content, 100)}</p>
                <div class="flex items-center space-x-3 text-xs text-gray-500">
                    <span>${article.autor}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        </a>
    `
}

// Función para crear el HTML de una noticia horizontal
export function createHorizontalArticleHTML(article) {
  const categoryClass = getCategoryClass(article.category)
  const hoverClass = getCategoryHoverClass(article.category)
  const timeAgo = formatTimeAgo(article.time_created)

  return `
        <a href="/article/${article.id}" class="md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="flex flex-col md:flex-row h-auto md:h-32">
                <div class="relative w-full md:w-48 h-32 md:h-full flex-shrink-0">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <span class="inline-block px-3 py-1 text-xs font-semibold ${categoryClass} text-white rounded-full mb-2">${article.category}</span>
                        <h3 class="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300 ${hoverClass}">${article.title}</h3>
                        <p class="text-gray-600 text-sm line-clamp-2">${truncateText(article.content, 120)}</p>
                    </div>
                    <div class="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </div>
        </a>
    `
}

// Función para crear el HTML de noticias pequeñas
export function createSmallArticlesHTML(articles) {
  const articlesHTML = articles
    .map((article) => {
      const categoryClass = getCategoryClass(article.category)
      const hoverClass = getCategoryHoverClass(article.category)
      const timeAgo = formatTimeAgo(article.time_created)

      return `
            <a href="/article/${article.id}" class="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="relative h-24">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <span class="inline-block px-2 py-1 text-xs font-semibold ${categoryClass} text-white rounded-full mb-2">${article.category}</span>
                    <h4 class="font-semibold text-sm mb-2 line-clamp-3 transition-colors duration-300 ${hoverClass}">${article.title}</h4>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </a>
        `
    })
    .join("")

  return `
        <div class="md:col-span-4 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            ${articlesHTML}
        </div>
    `
}

// Función principal para renderizar las noticias
export function renderNews(articles) {
  const newsGrid = document.getElementById("news-grid")

  if (!articles || articles.length === 0) {
    showError()
    return
  }

  // Separar artículos por posición en el grid
  const mainArticle = articles[0]
  const secondaryArticles = articles.slice(1, 6)
  const smallArticles = articles.slice(6, 9)

  let gridHTML = ""

  // Artículo principal
  if (mainArticle) {
    gridHTML += createMainArticleHTML(mainArticle)
  }

  // Artículos secundarios con diferentes layouts
  secondaryArticles.forEach((article, index) => {
    if (index === 0) {
      gridHTML += createSecondaryArticleHTML(article, "large")
    } else if (index === 1 || index === 4) {
      gridHTML += createSecondaryArticleHTML(article, "small")
    } else if (index === 2) {
      gridHTML += createSecondaryArticleHTML(article, "large")
    } else if (index === 3) {
      gridHTML += createHorizontalArticleHTML(article)
    }
  })

  // Noticias pequeñas
  if (smallArticles.length > 0) {
    gridHTML += createSmallArticlesHTML(smallArticles)
  }

  newsGrid.innerHTML = gridHTML
}

// Función para mostrar error
export function showError() {
  document.getElementById("error-message")?.classList.remove("hidden")
  const newsGrid = document.getElementById("news-grid")
  if (newsGrid) newsGrid.style.display = "none"
}

// Función para ocultar loading
export function hideLoading() {
  document.getElementById("loading-screen")?.classList.add("hidden")
}

// Función para obtener noticias (con fallback a datos mock)
export async function fetchNews() {
  try {
    // Intentar obtener datos de la API
    const response = await fetch(`${API_BASE_URL}/api/notices`)

    if (!response.ok) {
      throw new Error("API no disponible")
    }

    const result = await response.json()
    return result.notices || mockNewsData
  } catch (error) {
    console.log("Usando datos mock:", error.message)
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockNewsData
  }
}
